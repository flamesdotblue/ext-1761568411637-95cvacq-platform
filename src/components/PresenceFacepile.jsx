import { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const WS_ENDPOINT = 'wss://demos.yjs.dev';

export default function PresenceFacepile({ activeDocId, user }) {
  const [peers, setPeers] = useState([]);

  // Maintain a lightweight awareness-only provider separate from editor provider,
  // so the facepile keeps updating even when editor re-mounts.
  useEffect(() => {
    if (!activeDocId) return;
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WS_ENDPOINT, `room-${activeDocId}`, ydoc, { connect: true });
    provider.awareness.setLocalStateField('user', {
      id: user.id,
      name: user.name,
      color: user.color,
    });

    const updatePeers = () => {
      const states = Array.from(provider.awareness.getStates().values());
      const mapped = states
        .map(s => s.user)
        .filter(Boolean)
        .reduce((acc, u) => {
          acc.set(u.id, u);
          return acc;
        }, new Map());
      setPeers(Array.from(mapped.values()));
    };

    provider.awareness.on('change', updatePeers);
    updatePeers();

    return () => {
      provider.awareness.off('change', updatePeers);
      provider.destroy();
      ydoc.destroy();
    };
  }, [activeDocId, user.id, user.name, user.color]);

  const facepile = useMemo(() => peers.slice(0, 5), [peers]);
  const extra = peers.length - facepile.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {facepile.map(p => (
          <div key={p.id} className="h-7 w-7 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: p.color }} title={p.name}>
            {p.name.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
        ))}
        {extra > 0 && (
          <div className="h-7 w-7 rounded-full ring-2 ring-white bg-neutral-200 text-neutral-700 flex items-center justify-center text-[10px] font-medium" title={`+${extra} more`}>
            +{extra}
          </div>
        )}
      </div>
      <span className="text-xs text-neutral-500">{peers.length} active</span>
    </div>
  );
}
