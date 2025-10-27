import { useMemo, useState } from 'react';
import { Plus, FileText, Lock, Globe, Search, Trash2 } from 'lucide-react';

export default function Sidebar({ user, publicDocs = [], privateDocs = [], activeDocId, onSelect, onCreatePrivate, onRename, onDelete }) {
  const [query, setQuery] = useState('');

  const filteredPublic = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return publicDocs;
    return publicDocs.filter(d => d.title.toLowerCase().includes(q));
  }, [publicDocs, query]);

  const filteredPrivate = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return privateDocs;
    return privateDocs.filter(d => d.title.toLowerCase().includes(q));
  }, [privateDocs, query]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: user.color }}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-neutral-900 truncate">{user.name}</div>
            <div className="text-xs text-neutral-500 truncate">Logged in locally</div>
          </div>
        </div>
        <button
          onClick={onCreatePrivate}
          className="mt-3 inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white text-sm px-3 py-2 hover:bg-neutral-800 transition"
        >
          <Plus size={16} /> New private doc
        </button>
      </div>

      <div className="px-3 py-2 border-b border-neutral-200">
        <div className="flex items-center gap-2 rounded-md bg-white ring-1 ring-neutral-200 px-2 py-1.5 focus-within:ring-neutral-300">
          <Search size={16} className="text-neutral-500" />
          <input
            className="w-full bg-transparent outline-none text-sm placeholder-neutral-400"
            placeholder="Search documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-auto p-2">
        <Section title="Public" icon={<Globe size={14} className="text-neutral-500" />}> 
          {filteredPublic.length === 0 && <EmptyRow text="No matches" />}
          {filteredPublic.map(doc => (
            <Row
              key={doc.id}
              active={doc.id === activeDocId}
              title={doc.title}
              icon={<FileText size={16} className="text-neutral-500" />}
              onClick={() => onSelect(doc.id)}
              meta={<span className="text-[10px] uppercase tracking-wide text-neutral-400">Public</span>}
            />
          ))}
        </Section>

        <Section title="My Documents" icon={<Lock size={14} className="text-neutral-500" />}>
          {filteredPrivate.length === 0 && <EmptyRow text="No matches" />}
          {filteredPrivate.map(doc => (
            <Row
              key={doc.id}
              active={doc.id === activeDocId}
              title={doc.title}
              icon={<FileText size={16} className="text-neutral-500" />}
              onClick={() => onSelect(doc.id)}
              actions={
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              }
            />
          ))}
        </Section>
      </nav>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="mb-4">
      <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 flex items-center gap-2 uppercase tracking-wide">
        {icon} {title}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function Row({ active, title, icon, onClick, meta, actions }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-md text-left hover:bg-neutral-100 ${active ? 'bg-neutral-200/60' : ''}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="truncate text-sm text-neutral-800">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {meta}
        {actions}
      </div>
    </button>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="px-2 py-2 text-xs text-neutral-400">{text}</div>
  );
}
