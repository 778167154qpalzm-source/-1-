import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTableData } from '../../db/storage';
import { SCHEMAS, TABLE_GROUPS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';
import { 
  Building2, 
  Network, 
  FolderTree, 
  CheckCircle2, 
  Table2, 
  GitMerge, 
  CalendarRange, 
  Target, 
  Receipt, 
  Users2, 
  ArrowUpRight, 
  Layers, 
  TrendingUp, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { t, language, setCurrentView, setSelectedTable, dbVersion, setActiveModal } = useApp();

  // Load live counts from LocalStorage
  const companies = getTableData('Companies');
  const accounts = getTableData('ChartOfAccounts');
  const fiscalYears = getTableData('FiscalYears');
  const costCenters = getTableData('CostCenters');
  const journalEntries = getTableData('JournalEntries');
  const users = getTableData('Users');
  const auditLogs = getTableData('AuditLogs');
  const accountTypes = getTableData('AccountTypes');

  const parentAccountsCount = accounts.filter(a => a.IsParent).length;
  const postingAccountsCount = accounts.filter(a => a.IsPostingAllowed).length;

  // Calculate journal debits and credits
  const totalDebits = journalEntries.reduce((sum, j) => sum + (Number(j.TotalDebit) || 0), 0);
  const totalCredits = journalEntries.reduce((sum, j) => sum + (Number(j.TotalCredit) || 0), 0);
  const isJournalBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  // Accounts by type breakdown
  const accountsByType = accountTypes.map(type => {
    const count = accounts.filter(a => a.AccountTypeId === type.AccountTypeId).length;
    const percentage = accounts.length > 0 ? Math.round((count / accounts.length) * 100) : 0;
    return {
      typeId: type.AccountTypeId,
      name: language === 'ar' ? type.TypeNameAr : type.TypeNameEn,
      count,
      percentage
    };
  });

  const kpis = [
    { label: t('totalCompanies'), value: companies.length, icon: Building2, color: 'from-blue-500 to-indigo-600', link: 'Companies' },
    { label: t('totalAccounts'), value: accounts.length, icon: Network, color: 'from-indigo-500 to-purple-600', link: 'ChartOfAccounts' },
    { label: t('parentAccounts'), value: parentAccountsCount, icon: FolderTree, color: 'from-purple-500 to-pink-600', link: 'ChartOfAccounts' },
    { label: t('subAccounts'), value: postingAccountsCount, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600', link: 'ChartOfAccounts' },
    { label: t('totalTables'), value: SCHEMAS.length, icon: Table2, color: 'from-amber-500 to-orange-600', link: 'tables' },
    { label: t('totalRelations'), value: RELATIONSHIPS.length, icon: GitMerge, color: 'from-cyan-500 to-blue-600', link: 'relationships' },
    { label: t('fiscalYears'), value: fiscalYears.length, icon: CalendarRange, color: 'from-teal-500 to-emerald-600', link: 'FiscalYears' },
    { label: t('costCenters'), value: costCenters.length, icon: Target, color: 'from-rose-500 to-red-600', link: 'CostCenters' },
    { label: t('journalEntries'), value: journalEntries.length, icon: Receipt, color: 'from-violet-500 to-purple-700', link: 'JournalEntries' },
    { label: t('systemUsers'), value: users.length, icon: Users2, color: 'from-sky-500 to-indigo-600', link: 'Users' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-950/70 to-slate-900 border border-blue-500/20 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              {language === 'ar' ? 'نظام إدارة قواعد البيانات المحاسبية' : 'Accounting Database Architecture'}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {language === 'ar'
                ? 'مرحباً بك في مصمم شجرة الحسابات ومخطط ERD المتكامل'
                : 'Welcome to Accounting Database & COA Designer'}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'تم بناء بنية قاعدة البيانات المحاسبية المتكاملة (18 جدولاً مترابطاً) مع تخزين محلي بالكامل في LocalStorage. استعرض الشجرة الهرمية، وحرّك جداول مخطط ERD، وأجرِ القيود وعمليات CRUD فوراً.'
                : 'Full general ledger schema with 18 interlinked tables stored 100% in client-side LocalStorage. Explore the recursive hierarchy, drag ERD cards, and manage records.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('chart-of-accounts')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Network className="w-4 h-4" />
              <span>{t('chartOfAccounts')}</span>
            </button>
            <button
              onClick={() => setCurrentView('erd-diagram')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{t('erdDiagram')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 Statistics KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                if (kpi.link === 'tables' || kpi.link === 'relationships' || kpi.link === 'chart-of-accounts') {
                  setCurrentView(kpi.link as any);
                } else {
                  setSelectedTable(kpi.link);
                  setCurrentView('table-details');
                }
              }}
              className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300">
                  {kpi.label}
                </span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-md shadow-indigo-950/40`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black font-mono text-white">
                  {kpi.value}
                </span>
                <span className="text-slate-500 group-hover:text-blue-400 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Account Breakdown & Financial Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Types Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'توزيع شجرة الحسابات حسب نوع الحساب' : 'Chart of Accounts by Type'}
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('chart-of-accounts')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'فتح الشجرة' : 'View Tree'}</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </button>
          </div>

          <div className="space-y-3.5">
            {accountsByType.map(item => (
              <div key={item.typeId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{item.count} {language === 'ar' ? 'حساب' : 'accounts'}</span>
                    <span className="text-indigo-400 font-bold">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Double-Entry Journal Health */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'ar' ? 'توازن القيود اليومية' : 'Journal Balance Health'}
                </h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isJournalBalanced ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {isJournalBalanced ? (language === 'ar' ? 'متوازن 100%' : 'Balanced') : (language === 'ar' ? 'فارق توازن' : 'Unbalanced')}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">{language === 'ar' ? 'إجمالي المدين' : 'Total Debit'}</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">{language === 'ar' ? 'إجمالي الدائن' : 'Total Credit'}</span>
                <span className="text-sm font-bold font-mono text-purple-400">
                  {totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })} SAR
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTable('JournalEntries');
              setCurrentView('table-details');
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <span>{language === 'ar' ? 'استعراض القيود اليومية' : 'View Journal Vouchers'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Table Groups Catalog */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Table2 className="w-4 h-4 text-amber-400" />
          <span>{language === 'ar' ? 'مجموعات الجداول الـ18 في قاعدة البيانات' : 'The 18 Accounting Database Tables'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TABLE_GROUPS.map(group => {
            const groupTables = SCHEMAS.filter(s => s.groupId === group.id);
            return (
              <div
                key={group.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {language === 'ar' ? group.nameAr : group.nameEn}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      {groupTables.length} {language === 'ar' ? 'جداول' : 'tables'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {language === 'ar' ? group.descriptionAr : group.descriptionEn}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {groupTables.map(t => (
                    <button
                      key={t.name}
                      onClick={() => {
                        setSelectedTable(t.name);
                        setCurrentView('table-details');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600/30 hover:text-blue-300 text-[11px] font-mono text-slate-300 border border-slate-700/60 transition-all"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Logs Quick Feed */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              {language === 'ar' ? 'سجل العمليات والتدقيق الأخير (Audit Trail)' : 'Recent Audit Activity Log'}
            </h3>
          </div>
          <button
            onClick={() => {
              setSelectedTable('AuditLogs');
              setCurrentView('table-details');
            }}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {language === 'ar' ? 'عرض السجل كاملاً' : 'View All Logs'}
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.AuditLogId} className="py-2.5 flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  log.ActionType === 'INSERT'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : log.ActionType === 'POST' || log.ActionType === 'APPROVE'
                    ? 'bg-blue-500/20 text-blue-400'
                    : log.ActionType === 'UPDATE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {log.ActionType}
                </span>
                <span className="font-mono text-slate-300 font-semibold">{log.TableName}</span>
                <span className="text-slate-400 truncate">{log.Notes}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                {log.ActionDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
