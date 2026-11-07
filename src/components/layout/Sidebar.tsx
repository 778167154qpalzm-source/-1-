import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { 
  LayoutDashboard, 
  Network, 
  Boxes, 
  Table2, 
  GitMerge, 
  HardDriveDownload, 
  Settings as SettingsIcon,
  Building2,
  Database,
  Sparkles
} from 'lucide-react';
import { SCHEMAS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, t, language } = useApp();

  const navItems: { id: AppView; label: string; icon: React.FC<any>; badge?: string | number }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'chart-of-accounts', label: t('chartOfAccounts'), icon: Network },
    { id: 'erd-diagram', label: t('erdDiagram'), icon: Boxes },
    { id: 'tables', label: t('tables'), icon: Table2, badge: SCHEMAS.length },
    { id: 'relationships', label: t('relationships'), icon: GitMerge, badge: RELATIONSHIPS.length },
    { id: 'data-manager', label: t('dataManager'), icon: HardDriveDownload },
    { id: 'settings', label: t('settings'), icon: SettingsIcon }
  ];

  return (
    <aside className="w-64 bg-[#0B1120] border-e border-slate-800 flex flex-col h-screen shrink-0 select-none z-30">
      {/* Brand & Logo */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-sm tracking-tight text-white truncate">
              {language === 'ar' ? 'مصمم المحاسبة' : 'Accounting DB'}
            </h1>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-mono font-semibold border border-blue-500/30">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {language === 'ar' ? 'قواعد البيانات والدليل' : 'Schema & COA Designer'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          {language === 'ar' ? 'التنقل الرئيسي' : 'MAIN NAVIGATION'}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-md shadow-blue-600/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Engine Status / Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'ar' ? 'المحرك المحلي' : 'Local Storage Engine'}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Active
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          {language === 'ar'
            ? '18 جدولاً محاسبياً و 30 علاقة مرتبطة مخزنة محلياً في المتصفح بالكامل دون خوادم خارجية.'
            : '18 accounting tables & 30 relationships stored 100% in local storage.'}
        </p>
      </div>
    </aside>
  );
};
