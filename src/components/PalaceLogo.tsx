import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PalaceLogo: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-10 h-10'
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-5.5 sm:h-5.5',
    lg: 'w-6 h-6'
  }[size];

  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1.5px] shadow-md shadow-amber-950/40 shrink-0 group-hover:scale-105 transition-all duration-300 ${sizeClasses} ${className}`}
    >
      <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
        {/* Subtle royal ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-amber-300/30" />

        {/* Ornate Royal Palace Crest & Crown Emblem */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSizes} relative z-10`}
        >
          {/* Top Royal Crown with Finial Diamonds */}
          <path
            d="M16 4.5L18.8 9.5L24 7.5L21.5 13.5H10.5L8 7.5L13.2 9.5L16 4.5Z"
            fill="url(#royalGoldGrad)"
          />
          <circle cx="16" cy="3.5" r="1.2" fill="#FEF08A" />
          <circle cx="8" cy="6.8" r="1" fill="#FEF08A" />
          <circle cx="24" cy="6.8" r="1" fill="#FEF08A" />

          {/* Palace Archway & Royal Dome Facade */}
          <path
            d="M9 15.5C9 15.5 12 14 16 14C20 14 23 15.5 23 15.5V26.5H9V15.5Z"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Grand Jharokha Archway / Keyhole Palace Portal */}
          <path
            d="M13 26.5V20C13 18.3431 14.3431 17 16 17C17.6569 17 19 18.3431 19 20V26.5"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Central Royal Star / Sunburst */}
          <circle cx="16" cy="18.5" r="1" fill="#FEF08A" />

          {/* Decorative Pillars / Flanking Minarets */}
          <line
            x1="7"
            y1="14"
            x2="7"
            y2="26.5"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="14"
            x2="25"
            y2="26.5"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="7" cy="13" r="0.8" fill="#FEF08A" />
          <circle cx="25" cy="13" r="0.8" fill="#FEF08A" />

          {/* Solid Base Plinth */}
          <line
            x1="5.5"
            y1="27.5"
            x2="26.5"
            y2="27.5"
            stroke="url(#royalGoldGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="royalGoldGrad"
              x1="5"
              y1="3"
              x2="27"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FEF08A" />
              <stop offset="0.45" stopColor="#F59E0B" />
              <stop offset="0.8" stopColor="#D97706" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
