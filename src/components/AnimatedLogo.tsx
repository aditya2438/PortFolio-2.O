import React from 'react';
import { motion } from 'motion/react';

interface AnimatedLogoProps {
  size?: 'sm' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'sm' }) => {
  const isLg = size === 'lg';
  const dim = isLg ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-9 w-9';

  return (
    <motion.div
      whileHover={{ scale: 1.09, rotate: isLg ? 0 : 8 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 360, damping: 20 }}
      className={`relative inline-flex shrink-0 items-center justify-center ${dim}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
        className="h-full w-full overflow-visible"
      >
        {/* Outer kinetic orbiting ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#logoGradSaffron)"
          strokeWidth={isLg ? '2.5' : '3'}
          strokeDasharray="20 9 7 9"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Counter-rotating inner orbital arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="36"
          stroke="url(#logoGradRose)"
          strokeWidth={isLg ? '2' : '2.2'}
          strokeDasharray="44 34"
          strokeLinecap="round"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* Orbiting energy beacon */}
        {isLg && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <circle cx="95" cy="50" r="3.4" fill="#ff9f1c" />
            <circle cx="5" cy="50" r="2.6" fill="#2ec4b6" />
          </motion.g>
        )}

        {/* Center geometric shield backdrop */}
        <circle cx="50" cy="50" r="28" fill="#0d132b" stroke="rgba(34,211,238,0.28)" strokeWidth="1.5" />

        {/* Dynamic AC monogram path */}
        <motion.path
          d="M32.5 61 L42 37.5 L51.5 61 M36.2 53.5 H47.8"
          stroke="#22d3ee"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0.15, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M68 42 C64.2 37.5 55.8 38.2 54 49.5 C52.2 60.8 64.2 62.5 68 57.5"
          stroke="#f8fafc"
          strokeWidth="4.2"
          strokeLinecap="round"
          initial={{ pathLength: 0.15, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        />

        <defs>
          <linearGradient id="logoGradSaffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="logoGradRose" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9f1c" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};
