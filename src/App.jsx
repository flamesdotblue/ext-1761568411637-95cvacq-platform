import { useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import Sidebar from './components/Sidebar';
import EditorArea from './components/EditorArea';
import PresenceFacepile from './components/PresenceFacepile';

function randomColor() {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomName() {
  const first = ['Ava', 'Noah', 'Liam', 'Emma', 'Mia', 'Leo', 'Zoe', 'Ivy', 'Max', 'Eli', 'Ada', 'Kai', 'Nia', 'Sam', 'Liv'];
  const last = ['Gray', 'Wren', 'Vale', 'Reed', 'Quinn', 'Knox', 'Jett', 'Skye', 'Lane', 'Bryn'];
  return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

function generateId(prefix = 'doc') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

const PUBLIC_DOCS = [
  { id: 'public-welcome', title: 'Welcome to Notion-like Docs', visibility: 'public' },
  { id: 'public-team-handbook', title: 'Team Handbook (Public)', visibility: 'public' },
  { id: 'public-roadmap', title: 'Product Roadmap (Public)', visibility: 'public' },
];

const STORAGE_KEY = 'notionish.privateDocs.v1';
const STORAGE_ACTIVE = 'notionish.activeDoc.v1';
const STORAGE_USER = 'notionish.user.v1';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_USER);
    if (saved) return JSON.parse(saved);
    const u = { id: generateId('user'), name: randomName(), color: randomColor() };
    localStorage.setItem(STORAGE_USER, JSON.stringify(u));
    return u;
  });

  const [privateDocs, setPrivateDocs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    const initial = [
      { id: generateId('doc'), title: 'My First Note', visibility: 'private' },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_ACTIVE);
    if (saved) return saved;
    return PUBLIC_DOCS[0].id;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(privateDocs));
  }, [privateDocs]);

  useEffect(() => {
    if (activeDocId) localStorage.setItem(STORAGE_ACTIVE, activeDocId);
  }, [activeDocId]);

  const allDocs = useMemo(() => {
    return {
      public: PUBLIC_DOCS,
      private: privateDocs,
    };
  }, [privateDocs]);

  const activeDoc = useMemo(() => {
    const all = [...allDocs.public, ...allDocs.private];
    return all.find(d => d.id === activeDocId) || all[0];
  }, [allDocs, activeDocId]);

  function handleCreateDoc(visibility = 'private') {
    const newDoc = { id: generateId('doc'), title: 'Untitled', visibility };
    if (visibility === 'private') {
      setPrivateDocs(prev => [newDoc, ...prev]);
    }
    setActiveDocId(newDoc.id);
  }

  function handleRenameDoc(id, title) {
    setPrivateDocs(prev => prev.map(d => (d.id === id ? { ...d, title } : d)));
  }

  function handleDeleteDoc(id) {
    setPrivateDocs(prev => prev.filter(d => d.id !== id));
    if (activeDocId === id) setActiveDocId(PUBLIC_DOCS[0].id);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <header className="w-full">
        <HeroCover />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 shrink-0 border-r border-neutral-200 bg-neutral-50/60 backdrop-blur-sm">
          <Sidebar
            user={user}
            publicDocs={allDocs.public}
            privateDocs={allDocs.private}
            activeDocId={activeDoc?.id}
            onSelect={setActiveDocId}
            onCreatePrivate={() => handleCreateDoc('private')}
            onRename={handleRenameDoc}
            onDelete={handleDeleteDoc}
          />
        </aside>

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="px-6 pt-4 pb-2 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-7 w-1.5 rounded-full" style={{ backgroundColor: user.color }} />
              <input
                className="text-xl font-medium bg-transparent outline-none focus:ring-0 min-w-0 w-full placeholder-neutral-400"
                value={activeDoc?.title || ''}
                placeholder="Untitled"
                onChange={(e) => activeDoc?.visibility === 'private' && handleRenameDoc(activeDoc.id, e.target.value)}
                readOnly={activeDoc?.visibility !== 'private'}
              />
            </div>
            <PresenceFacepile activeDocId={activeDoc?.id} user={user} />
          </div>

          <div className="flex-1 min-h-0">
            {activeDoc && (
              <EditorArea key={activeDoc.id} docId={activeDoc.id} user={user} />
            )}
          </div>
        </main>
      </div>

      <footer className="border-t border-neutral-200 text-sm text-neutral-500 px-6 py-3 flex items-center justify-between">
        <span>Minimal collaborative editor demo</span>
        <span>Public docs are shared globally via Yjs room. Private docs are local to your browser list.</span>
      </footer>
    </div>
  );
}
