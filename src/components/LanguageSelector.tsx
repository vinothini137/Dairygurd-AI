import React from 'react';
import { Languages, Check, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../utils/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-900/50 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shrink-0">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                {t('languageSectionTitle')}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                {t('switchLanguage')}
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              {t('languageSectionDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-emerald-200 font-semibold">{t('activeLanguage')}:</span>
          <strong className="text-white">
            {languages.find((l) => l.code === language)?.nativeName}
          </strong>
        </div>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code as SupportedLanguage)}
              className={`text-left p-3.5 rounded-2xl border-2 transition-all relative flex flex-col justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-md shadow-emerald-900/30 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl">{lang.flag}</span>
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : lang.compulsory ? (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                    {t('compulsoryBadge')}
                  </span>
                ) : null}
              </div>

              <div className="mt-3">
                <span className="font-black text-sm block leading-tight text-white group-hover:text-emerald-300 transition-colors">
                  {lang.nativeName}
                </span>
                <span className="text-[11px] text-emerald-200/70 font-medium block mt-0.5">
                  {lang.name}
                </span>
              </div>

              {lang.compulsory && (
                <span className="mt-2 text-[10px] text-emerald-300 font-bold block">
                  ★ {t('compulsoryBadge')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2 text-center text-xs text-emerald-200/70">
        <span>
          {t('compulsoryNotice')}
        </span>
      </div>
    </div>
  );
};
