import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-xl border border-[#ff9f1c]/45 bg-[#120e1c]/95 px-3.5 py-2 font-mono text-xs font-medium text-[#ff9f1c] shadow-2xl backdrop-blur-xl"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>Offline Mode — Viewing cached portfolio</span>
    </div>
  );
};
