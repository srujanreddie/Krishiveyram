import React from 'react';
import { Home, ScanLine, FlaskConical, CloudSun, BookOpen, PhoneCall } from 'lucide-react';
import { SupportedLanguage, UI_TEXTS } from '../utils/translations';

export type TabType = 'home' | 'scanner' | 'medicine' | 'weather' | 'diary' | 'helpline';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentLang: SupportedLanguage;
  hasActiveAlarm?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  currentLang,
  hasActiveAlarm = false,
}) => {
  const texts = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const navItems = [
    { id: 'home' as TabType, label: texts.navHome, icon: Home },
    { id: 'scanner' as TabType, label: texts.navScanner, icon: ScanLine, highlight: true },
    { id: 'medicine' as TabType, label: texts.navMedicine, icon: FlaskConical },
    { id: 'weather' as TabType, label: texts.navWeather, icon: CloudSun, hasBadge: hasActiveAlarm },
    { id: 'diary' as TabType, label: texts.navDiary, icon: BookOpen },
    { id: 'helpline' as TabType, label: texts.navExpert, icon: PhoneCall },
  ];

  return (
    <nav
      id="farmer-bottom-navigation"
      aria-label="Farmer Quick Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-safe"
    >
      <div className="max-w-4xl mx-auto px-2 flex items-center justify-around h-16 sm:h-18">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (item.highlight) {
            // Scanner center floating button
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white ring-4 ring-emerald-100 shadow-emerald-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-105'
                  }`}
                >
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold mt-1 tracking-tight transition ${
                    isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 relative rounded-xl transition active:scale-95 ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                    isActive ? 'stroke-[2.4] text-emerald-700 scale-110' : 'stroke-[1.8]'
                  }`}
                />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-1 truncate max-w-[64px] sm:max-w-[76px] ${
                  isActive ? 'font-extrabold text-emerald-800' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-1 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
