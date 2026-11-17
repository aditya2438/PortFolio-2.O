import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <motion.button
        type="button"
        onClick={install}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Install portfolio app to home screen"
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#22d3ee]/45 bg-[#22d3ee]/14 px-3.5 py-2 text-xs font-bold text-[#22d3ee] whitespace-nowrap shrink-0 transition-colors hover:bg-[#22d3ee]/25 cursor-pointer ${className}`}
      >
        <Download className="h-3.5 w-3.5" />
        <span>{compact ? 'Install' : 'Install App'}</span>
      </motion.button>
    );
  }

  if (isIOS) {
    return (
      <>
        <motion.button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="How to add portfolio to iPhone home screen"
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#22d3ee]/45 bg-[#22d3ee]/14 px-3.5 py-2 text-xs font-bold text-[#22d3ee] whitespace-nowrap shrink-0 transition-colors hover:bg-[#22d3ee]/25 cursor-pointer ${className}`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>{compact ? 'Add App' : 'Install on iOS'}</span>
        </motion.button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Add to iOS Home Screen"
            onClick={() => setShowIOSGuide(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="glass-surface w-full max-w-sm rounded-2xl p-6 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-base font-bold text-[#faf7f2]">
                  Install on iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close iOS install instructions"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm text-stone-300">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff9f1c]/20 font-mono text-xs font-bold text-[#ff9f1c]">
                    1
                  </span>
                  <span>
                    Tap the <strong className="inline-flex items-center gap-1 text-[#faf7f2]">Share <Share className="inline h-3.5 w-3.5 text-[#2ec4b6]" /></strong> button in Safari.
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2ec4b6]/20 font-mono text-xs font-bold text-[#2ec4b6]">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong className="text-[#faf7f2]">Add to Home Screen</strong>.
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 min-h-[42px] w-full rounded-xl bg-[#ff9f1c] px-4 py-2 text-xs font-bold text-[#090710] hover:bg-[#fbbf24] cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
