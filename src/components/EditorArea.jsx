import { useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const WS_ENDPOINT = 'wss://demos.yjs.dev';

export default function EditorArea({ docId, user }) {
  const { ydoc, provider, fragment } = useMemo(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WS_ENDPOINT, `room-${docId}`, ydoc, { connect: true });
    const fragment = ydoc.getXmlFragment('prosemirror');

    provider.awareness.setLocalStateField('user', {
      id: user.id,
      name: user.name,
      color: user.color,
    });

    return { ydoc, provider, fragment };
  }, [docId, user.id, user.name, user.color]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Placeholder.configure({ placeholder: 'Start typing your document...' }),
      Collaboration.configure({ document: fragment }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-neutral max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [editor, provider, ydoc]);

  return (
    <div className="h-full w-full overflow-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="text-sm text-neutral-500 mb-4">This document is synced in real-time with other users in the same room.</div>
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
