import React, { useState } from 'react';
import { Sprout, Globe, User, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { SupportedLanguage, LANGUAGE_OPTIONS } from '../utils/translations';
import { UserProfile } from '../types';
import { stopSpeaking } from '../utils/audioSpeech';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  isSpeaking: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  userProfile,
  onOpenProfile,
  isSpeaking,
  onToggleMute,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  const selectedLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLang) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <Sprout className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Outfit']">
                KrishiVeyra
              </span>
              <span className="bg-emerald-600/70 text-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                Kisan AI
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium truncate max-w-[170px] sm:max-w-[240px]">
              {userProfile.villageLocation || 'Bathinda, Punjab'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio Stop Button (shown if speaking) */}
          {isSpeaking && (
            <button
              onClick={() => {
                stopSpeaking();
                onToggleMute();
              }}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition active:scale-95 animate-bounce"
              title="Stop voice reading"
            >
              <VolumeX className="w-4 h-4 text-slate-900" />
              <span className="hidden sm:inline">Stop Voice</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-semibold tracking-wide transition active:scale-95"
              aria-label="Change Language"
            >
              <span className="text-sm">{selectedLangObj.flag}</span>
              <span className="font-bold">{selectedLangObj.nativeName}</span>
              <Globe className="w-3.5 h-3.5 text-emerald-200 ml-0.5" />
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language / भाषा चुनें
                  </div>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between hover:bg-emerald-50 transition ${
                        currentLang === lang.code ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Farmer Profile Button */}
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/50 flex items-center justify-center text-white transition active:scale-95 shadow-sm"
            title="Farmer Profile & Farm Settings"
          >
            <User className="w-4 h-4 text-emerald-100" />
          </button>
        </div>
      </div>
    </header>
  );
};
