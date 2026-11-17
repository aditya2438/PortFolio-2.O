import React from 'react';

export interface SkillBrandStyle {
  accent: string;
  tint: string;
  mastery: number;
}

export const SKILL_BRAND_META: Record<string, SkillBrandStyle> = {
  java21: { accent: '#f89820', tint: 'rgba(248, 152, 32, 0.16)', mastery: 96 },
  springboot: { accent: '#6db33f', tint: 'rgba(109, 179, 63, 0.16)', mastery: 95 },
  springai: { accent: '#22d3ee', tint: 'rgba(34, 211, 238, 0.16)', mastery: 88 },
  springsecurity: { accent: '#4ade80', tint: 'rgba(74, 222, 128, 0.16)', mastery: 92 },
  kafka: { accent: '#38bdf8', tint: 'rgba(56, 189, 248, 0.16)', mastery: 90 },
  redis: { accent: '#ff4438', tint: 'rgba(255, 68, 56, 0.16)', mastery: 93 },
  postgresql: { accent: '#60a5fa', tint: 'rgba(96, 165, 250, 0.16)', mastery: 94 },
  mysql: { accent: '#00a8e8', tint: 'rgba(0, 168, 232, 0.16)', mastery: 95 },
  hibernate: { accent: '#e5d59a', tint: 'rgba(229, 213, 154, 0.16)', mastery: 91 },
  docker: { accent: '#1d63ed', tint: 'rgba(29, 99, 237, 0.18)', mastery: 89 },
  sql: { accent: '#fbbf24', tint: 'rgba(251, 191, 36, 0.16)', mastery: 94 },
  javascript: { accent: '#f7df1e', tint: 'rgba(247, 223, 30, 0.16)', mastery: 90 },
  cpp: { accent: '#659ad2', tint: 'rgba(101, 154, 210, 0.16)', mastery: 91 },
  microservices: { accent: '#c084fc', tint: 'rgba(192, 132, 252, 0.16)', mastery: 92 },
  junit: { accent: '#25a162', tint: 'rgba(37, 161, 98, 0.16)', mastery: 89 },
  mongodb: { accent: '#00ed64', tint: 'rgba(0, 237, 100, 0.16)', mastery: 85 },
  supabase: { accent: '#3ecf8e', tint: 'rgba(62, 207, 142, 0.16)', mastery: 86 },
  git: { accent: '#f05032', tint: 'rgba(240, 80, 50, 0.16)', mastery: 94 },
  maven: { accent: '#fb7185', tint: 'rgba(251, 113, 133, 0.16)', mastery: 90 },
  postman: { accent: '#ff6c37', tint: 'rgba(255, 108, 55, 0.16)', mastery: 93 },
};

export const WhatsAppLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M16.01 3.2C8.95 3.2 3.22 8.93 3.22 15.99c0 2.26.59 4.46 1.71 6.4L3.1 29.04l6.81-1.79a12.74 12.74 0 0 0 6.1 1.55h.01c7.06 0 12.79-5.73 12.79-12.79 0-3.42-1.33-6.63-3.75-9.05A12.72 12.72 0 0 0 16.01 3.2Zm7.45 18.21c-.31.88-1.82 1.68-2.51 1.78-.64.1-1.45.14-2.34-.15-.54-.17-1.24-.4-2.14-.79-3.76-1.63-6.21-5.41-6.4-5.66-.19-.25-1.53-2.04-1.53-3.89s.97-2.76 1.31-3.13c.34-.38.75-.47 1-.47h.72c.23 0 .54-.09.85.65.31.76 1.07 2.61 1.16 2.8.09.19.16.41.03.66-.13.25-.19.41-.38.63-.19.22-.4.49-.57.66-.19.19-.39.39-.17.77.22.38.98 1.62 2.11 2.62 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.25.95-1.1 1.2-1.48.25-.38.51-.31.85-.19.34.13 2.2 1.04 2.57 1.23.38.19.63.28.72.44.1.16.1.91-.21 1.79Z" />
  </svg>
);

export const SkillLogo: React.FC<{ id: string; className?: string }> = ({
  id,
  className = 'h-7 w-7',
}) => {
  switch (id) {
    case 'java21':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Iconic Orange Java Steam Wisps */}
          <path
            d="M25.5 6c2.6 3.5-2.6 6.2-1.1 9.5 1.1 2.4 3.4 3.4 2.6 6.2"
            stroke="#F89820"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M30.5 9c1.9 2.6-1.9 4.7-.7 7.1.8 1.7 2.3 2.3 1.7 4.4"
            stroke="#FB923C"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Blue Porcelain Cup + Saucer Swirls */}
          <path
            d="M15 24.5h14.5v5.8c0 3.7-3.2 6.7-7.25 6.7S15 34 15 30.3v-5.8Z"
            fill="#5382A1"
          />
          <path
            d="M29.5 25.5h2.6a2.8 2.8 0 0 1 0 5.6h-2.6"
            stroke="#60A5FA"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M12.5 36.2c-2.5.9-3.6 2-2.6 3.1 1.7 1.9 13.7 2.5 22.8.8 4.4-.8 6.5-2.1 5.4-3.2"
            stroke="#5382A1"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M15.5 40.5c4.6 1.5 12.6 1.5 17 0"
            stroke="#F89820"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'springboot':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path
            d="M24 5.5L39.8 14.7v18.6L24 42.5 8.2 33.3V14.7L24 5.5Z"
            fill="#6DB33F"
          />
          {/* Authentic Inner Spring Power-Leaf Emblem */}
          <path
            d="M32.5 15.5c-7.5-.4-14.8 4.4-16.5 11.4-.6 2.5-.1 5.1 1.3 7.2 2.2-3.4 6.2-6.8 11.4-8.4-4 2.4-7.4 5.8-9.2 9.2 2.4 1.3 5.5 1.5 8.2.2 5.4-2.6 8.3-9.3 6.3-16.5-.3-1.1-.8-2.2-1.5-3.1Z"
            fill="#FFFFFF"
          />
          <circle cx="17.8" cy="31.5" r="1.5" fill="#6DB33F" />
        </svg>
      );

    case 'springai':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path
            d="M24 6L39 14.7v18.6L24 42 9 33.3V14.7L24 6Z"
            fill="#14532D"
            stroke="#4ADE80"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Glowing AI Four-Point Spark */}
          <path
            d="M24 12.5L27.2 21.8 36.5 25 27.2 28.2 24 37.5 20.8 28.2 11.5 25 20.8 21.8 24 12.5Z"
            fill="#22D3EE"
          />
          <circle cx="34.5" cy="14.5" r="2.5" fill="#C084FC" />
          <circle cx="14" cy="34" r="2" fill="#4ADE80" />
        </svg>
      );

    case 'springsecurity':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path
            d="M24 6L9.5 11.8v11.6c0 9.4 6.1 17.5 14.5 20.1V6Z"
            fill="#6DB33F"
          />
          <path
            d="M24 6l14.5 5.8v11.6c0 9.4-6.1 17.5-14.5 20.1V6Z"
            fill="#4D8B2A"
          />
          <rect x="18" y="21.5" width="12" height="9.5" rx="2.2" fill="#FFFFFF" />
          <path
            d="M20.5 21.5v-2.6a3.5 3.5 0 0 1 7 0v2.6"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="26.2" r="1.4" fill="#4D8B2A" />
        </svg>
      );

    case 'kafka':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Connecting spokes */}
          <path
            d="M21 12.5v23M23.5 21.5l10-6M23.5 26.5l10 6"
            stroke="#E2E8F0"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Satellite Rings */}
          <circle cx="21" cy="10" r="3.6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="21" cy="38" r="3.6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <circle cx="35.5" cy="14.5" r="3.6" fill="#0F172A" stroke="#FF9F1C" strokeWidth="2.5" />
          <circle cx="35.5" cy="33.5" r="3.6" fill="#0F172A" stroke="#FF9F1C" strokeWidth="2.5" />
          {/* Main Central Hub */}
          <circle cx="21" cy="24" r="5" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="2.6" />
        </svg>
      );

    case 'redis':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Bottom Cube Stack */}
          <path d="M24 30.5L7.5 24v5.5L24 36l16.5-6.5V24L24 30.5Z" fill="#991B1B" />
          {/* Middle Cube Stack */}
          <path d="M24 24L7.5 17.5V23L24 29.5 40.5 23v-5.5L24 24Z" fill="#DC2626" />
          {/* Top Vibrant Red Face */}
          <path d="M24 10.5L7.5 17 24 23.5 40.5 17 24 10.5Z" fill="#FF4438" />
          {/* Authentic Redis Geometric Icons */}
          <circle cx="29.5" cy="16.8" r="2.1" fill="#FFFFFF" />
          <rect x="21.8" y="12.8" width="4.4" height="3.2" transform="rotate(14 21.8 12.8)" fill="#FFFFFF" />
          <polygon points="15.5,17 18.8,15.4 18.8,18.6" fill="#FFFFFF" />
          <polygon points="24,18.2 26.2,20.5 21.8,20.5" fill="#FFFFFF" />
        </svg>
      );

    case 'postgresql':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Iconic Slonik Elephant Head + Trunk Silhouette */}
          <path
            d="M15.5 14c-4.2 0-7.5 3.6-7.5 8.4 0 4.6 2.8 8 6.8 8.4 1.1 0 1.8-.4 2.3-1v5.8c0 2.1 1.6 3.9 3.6 3.9 1.9 0 3.3-1.4 3.3-3.5v-4.2h4v4.2c0 2.5 1.8 4.4 4.2 4.4 2.2 0 3.8-1.5 3.8-3.8v-6.4c2.8-1.1 4.5-4 4.5-7.8 0-4.8-3.3-8.4-7.5-8.4-1.8 0-3.3.5-4.6 1.4-1.3-.9-2.8-1.4-4.4-1.4-1.6 0-3.1.5-4.4 1.4-1.3-.9-2.8-1.4-4.1-1.4Z"
            fill="#336791"
          />
          <path
            d="M18.5 14.8c2.6-2.8 8.4-2.8 11 0"
            stroke="#60A5FA"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Eyes & Ivory Tusks */}
          <circle cx="19.5" cy="20.5" r="1.7" fill="#FFFFFF" />
          <circle cx="28.5" cy="20.5" r="1.7" fill="#FFFFFF" />
          <path d="M21 26.8c-.4 3-2 4.6-3.8 5" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M27 26.8c.4 3 2 4.6 3.8 5" stroke="#E0F2FE" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'mysql':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Iconic Leaping Sakila Dolphin */}
          <path
            d="M11 33.5c3.5-9.5 10.2-17.2 19-18.8 2-.3 3.4-.2 4.2.5.4-2.2 1.7-3.8 3.8-4.7-1 2.2-.8 4.4.4 6.2 2.4 3.4 2.1 8-1.3 12-1.8 2.1-3.8 3.2-5.8 3.4 1.1-2.5.6-5.2-1.8-6.8-3.2-2.2-8.2-.4-11.5 3.7-2 2.5-4.5 4.2-7 4.5Z"
            fill="#00758F"
          />
          <path
            d="M15.5 28c4.2-6.2 9.5-10.2 15.8-11"
            stroke="#38BDF8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Signature Golden Fin & Smile Accent */}
          <path d="M21.5 16.2c.8-2.6 2.8-4.3 5.5-4.7-.8 2.2-.5 3.9.4 5.1" fill="#F29111" />
          <circle cx="32.5" cy="20" r="1.3" fill="#FFFFFF" />
        </svg>
      );

    case 'hibernate':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <polygon points="14,9 26,9 32,19.5 20,19.5" fill="#BCAE79" />
          <polygon points="14,9 20,19.5 14,30 8,19.5" fill="#59666C" />
          <polygon points="22,28.5 34,28.5 28,39 16,39" fill="#E5D59A" />
          <polygon points="34,18 40,28.5 34,39 28,28.5" fill="#7C878E" />
        </svg>
      );

    case 'docker':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Neat Stacked Sky-Blue Shipping Containers */}
          <rect x="13.5" y="18.5" width="4.8" height="4.8" rx="0.7" fill="#38BDF8" />
          <rect x="19.5" y="18.5" width="4.8" height="4.8" rx="0.7" fill="#7DD3FC" />
          <rect x="25.5" y="18.5" width="4.8" height="4.8" rx="0.7" fill="#38BDF8" />
          <rect x="19.5" y="12.5" width="4.8" height="4.8" rx="0.7" fill="#BAE6FD" />
          <rect x="25.5" y="12.5" width="4.8" height="4.8" rx="0.7" fill="#7DD3FC" />
          {/* Official Moby Blue Whale Body */}
          <path
            d="M7.5 25h28.8c2.2 0 4-1.4 5-4 2.2 1.4 2.7 4.3 1.4 7-2.6 5.4-8.8 9-18.7 9C13.6 37 8 31.8 7.5 25Z"
            fill="#1D63ED"
          />
          <circle cx="15" cy="30" r="1.4" fill="#FFFFFF" />
        </svg>
      );

    case 'sql':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Classic Multi-Disc Relational Database Cylinder */}
          <ellipse cx="24" cy="13.5" rx="13" ry="4.5" fill="#FBBF24" />
          <path d="M11 13.5v7.5c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5v-7.5c0 2.5-5.8 4.5-13 4.5s-13-2-13-4.5Z" fill="#D97706" />
          <path d="M11 22v7.5c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5V22c0 2.5-5.8 4.5-13 4.5S11 24.5 11 22Z" fill="#0284C7" />
          <path d="M11 30.5v6c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5v-6c0 2.5-5.8 4.5-13 4.5s-13-2-13-4.5Z" fill="#0369A1" />
          <circle cx="31.5" cy="27.5" r="2" fill="#FEF08A" />
        </svg>
      );

    case 'javascript':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <rect x="7" y="7" width="34" height="34" rx="5.5" fill="#F7DF1E" />
          {/* Crisp Official Bottom-Right Vector 'J' and 'S' */}
          <path
            d="M25.5 25.5v10.2c0 2.1-1.3 3-3.2 3-1.4 0-2.5-.7-3.1-1.8l2.5-1.5c.3.5.7.9 1.2.9.6 0 1-.3 1-1.1v-9.7h1.6Z"
            fill="#18181B"
            stroke="#18181B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M35.8 27.6c-.7-1.1-1.8-1.6-3-1.6-1.6 0-2.6.8-2.6 1.9 0 1.2.9 1.7 2.5 2.4l1 .4c2.1.9 3.4 2 3.4 4.1 0 2.4-1.9 3.9-4.6 3.9-2.5 0-4.2-1.1-5.1-2.8l2.6-1.5c.5.9 1.3 1.5 2.4 1.5 1.1 0 1.8-.5 1.8-1.3 0-.8-.6-1.2-2-1.8l-1-.4c-2-.8-3.4-1.9-3.4-4 0-2.2 1.8-3.8 4.4-3.8 2 0 3.5.7 4.4 2.1l-2.4 1.5Z"
            fill="#18181B"
          />
        </svg>
      );

    case 'cpp':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path d="M24 6L39.5 15v18L24 42 8.5 33V15L24 6Z" fill="#00599C" />
          <path d="M24 6L39.5 15v18L24 24V6Z" fill="#659AD2" />
          <path d="M24 24l15.5 9L24 42 8.5 33 24 24Z" fill="#004482" />
          {/* White C Circle + Double Plus */}
          <path
            d="M25.8 28.4a6.4 6.4 0 1 1 0-8.8"
            stroke="#FFFFFF"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M28.8 24h4M30.8 22v4M34.5 24h4M36.5 22v4"
            stroke="#FFFFFF"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'microservices':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path d="M18.5 15.5h11M15.5 21l5.5 8.5M32.5 21L27 29.5" stroke="#94A3B8" strokeWidth="2.3" strokeLinecap="round" />
          <polygon points="13.5,8 19,11.2 19,17.8 13.5,21 8,17.8 8,11.2" fill="#22D3EE" />
          <polygon points="34.5,8 40,11.2 40,17.8 34.5,21 29,17.8 29,11.2" fill="#FF9F1C" />
          <polygon points="24,26.5 29.5,29.7 29.5,36.3 24,39.5 18.5,36.3 18.5,29.7" fill="#C084FC" />
        </svg>
      );

    case 'junit':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <circle cx="24" cy="24" r="16.5" fill="#166534" />
          <path d="M24 7.5A16.5 16.5 0 0 1 40.5 24H24V7.5Z" fill="#DC2626" />
          <path d="M24 7.5A16.5 16.5 0 0 0 7.5 24H24V7.5Z" fill="#25A162" />
          <circle cx="24" cy="24" r="11.5" fill="#0F172A" />
          <path
            d="M18 24.5l4.2 4.2 8.8-9.2"
            stroke="#4ADE80"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'mongodb':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Left Leaf Halve */}
          <path d="M24 6.5C17.8 13 14.5 19.5 14.5 26.2c0 5.6 3.5 10.2 9.5 12.2V6.5Z" fill="#00ED64" />
          {/* Right Leaf Halve */}
          <path d="M24 6.5c6.2 6.5 9.5 13 9.5 19.7 0 5.6-3.5 10.2-9.5 12.2V6.5Z" fill="#13AA52" />
          <path d="M24 37.5V43" stroke="#A7F3D0" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'supabase':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path d="M27.2 7L11 26.5h13l-2.8 14.5L37 21.5H24L27.2 7Z" fill="#3ECF8E" />
          <path d="M24 21.5h13L21.2 41l2.8-14.5V21.5Z" fill="#249361" />
        </svg>
      );

    case 'git':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <path
            d="M22.1 7.2a2.7 2.7 0 0 1 3.8 0l14.9 14.9a2.7 2.7 0 0 1 0 3.8L25.9 40.8a2.7 2.7 0 0 1-3.8 0L7.2 25.9a2.7 2.7 0 0 1 0-3.8L22.1 7.2Z"
            fill="#F05032"
          />
          <path d="M19.5 13.5l10.2 10.2M24 18v12.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="18" r="2.8" fill="#FFFFFF" />
          <circle cx="24" cy="30.5" r="2.8" fill="#FFFFFF" />
          <circle cx="29.7" cy="23.7" r="2.8" fill="#FFFFFF" />
        </svg>
      );

    case 'maven':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          {/* Apache Prism Quill + M Emblem */}
          <path
            d="M36.5 9C25.5 11.5 15.8 20.2 11.5 39c6.2-5 12-7.2 17-7.2 4.5-6.2 7.5-13.8 8-22.8Z"
            fill="#E11D48"
          />
          <path
            d="M36.5 9C28 14.5 21.5 21.5 16.8 31.8h11.7c4.5-6.2 7.5-13.8 8-22.8Z"
            fill="#FF9F1C"
          />
          <path d="M11.5 39L32 14.5" stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );

    case 'postman':
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <circle cx="24" cy="24" r="16.5" fill="#FF6C37" />
          {/* Orbital Ring + Rocket Visor */}
          <ellipse
            cx="24"
            cy="24"
            rx="12.5"
            ry="5.2"
            transform="rotate(-32 24 24)"
            stroke="#FFFFFF"
            strokeWidth="2.3"
          />
          <circle cx="24.5" cy="23.5" r="5" fill="#FFFFFF" />
          <path d="M23 22l5.5-5.5M14.5 33l5-5" stroke="#FFF7ED" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
          <circle cx="24" cy="24" r="15" stroke="#22D3EE" strokeWidth="2.5" />
          <circle cx="24" cy="24" r="5" fill="#FF9F1C" />
        </svg>
      );
  }
};
