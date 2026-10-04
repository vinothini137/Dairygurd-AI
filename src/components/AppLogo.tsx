import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const dimensionClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Exact Uploaded Original DairyGuard AI Logo */}
      <div
        className={`${dimensionClass} shrink-0 select-none overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center`}
      >
        <img
          src="watermarked_img_5873010245630187781.png"
          alt="DairyGuard AI Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Support root path if relative path needs prefix
            const target = e.currentTarget;
            if (!target.src.includes('/watermarked_img_5873010245630187781.png')) {
              target.src = '/watermarked_img_5873010245630187781.png';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl tracking-tight text-slate-900">
              DairyGuard
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-300">
              AI
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold leading-tight">
            Official Livestock Companion
          </span>
        </div>
      )}
    </div>
  );
};
