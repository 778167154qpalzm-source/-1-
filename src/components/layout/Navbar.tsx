import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  PlusCircle, 
  Download, 
  Languages, 
  RotateCcw,
  Database,
  FileCode2
} from 'lucide-react';
import { SCHEMAS } from '../../db/schema';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    selectedTable, 
    searchTerm, 
    setSearchTerm, 
    language, 
    setLanguage, 
    t, 
    setActiveModal,
    setModalPayload 
  } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return t('dashboard');
      case 'chart-of-accounts':
        return t('chartOfAccounts');
      case 'erd-diagram':
        return t('erdDiagram');
      case 'tables':
        return t('tables');
      case 'table-details': {
        const schema = SCHEMAS.find(s => s.name === selectedTable);
        return schema ? `${t('tableDetails')}: ${language === 'ar' ? schema.nameAr : schema.nameEn} (${schema.name})` : t('tableDetails');
      }
      case 'relationships':
        return t('relationships');
      case 'data-manager':
        return t('dataManager');
      case 'settings':
        return t('settings');
      default:
        return t('appTitle');
    }
  };

  return (
    <header className="h-16 bg-[#0B1120]/95 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0">
      {/* Title & Path */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 truncate">
            {getPageTitle()}
          </h2>
          <span className="text-[11px] text-slate-400 hidden sm:block">
            {t('appSubtitle')}
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-900/90 text-xs text-white placeholder-slate-400 rounded-xl ps-10 pe-4 py-2 border border-slate-700/60 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Add Account Button */}
        <button
          onClick={() => {
            setModalPayload({ mode: 'add' });
            setActiveModal('addAccount');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm shadow-blue-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t('addAccount')}</span>
        </button>

        {/* Add Record to Current Table Button */}
        <button
          onClick={() => {
            setModalPayload({ tableName: selectedTable || 'Companies', mode: 'add' });
            setActiveModal('addRecord');
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95 hidden sm:flex"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t('addTableRecord')}</span>
        </button>

        {/* Export Modal Button */}
        <button
          onClick={() => setActiveModal('export')}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all hover:text-white"
          title={t('exportData')}
        >
          <Download className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Reset Database Button */}
        <button
          onClick={() => setActiveModal('resetConfirm')}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all hover:text-rose-400"
          title={t('resetData')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-all hover:text-white"
          title="Switch Language / تغيير اللغة"
        >
          <Languages className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold">{t('switchLang')}</span>
        </button>
      </div>
    </header>
  );
};
