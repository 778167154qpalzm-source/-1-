import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getTableData, deleteRecord, updateRecord } from '../../db/storage';
import { canDeleteAccount } from '../../db/validation';
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Edit3, 
  Trash2, 
  FolderTree, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  FileText, 
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Tag,
  Hash,
  AlertTriangle,
  FolderOpen,
  Folder
} from 'lucide-react';

interface AccountNode {
  account: any;
  children: AccountNode[];
}

export const ChartOfAccountsView: React.FC = () => {
  const { t, language, searchTerm, setSearchTerm, setActiveModal, setModalPayload, showNotification, dbVersion } = useApp();

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(4); // Default to Cash account
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<number>>(new Set([1, 2, 3, 7, 9, 11, 14, 15, 18, 19, 22, 23, 26, 27]));
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<number | 'all'>('all');
  const [filterPostingOnly, setFilterPostingOnly] = useState<boolean>(false);

  // Load all accounts, types, natures, levels, and categories
  const accounts = getTableData('ChartOfAccounts');
  const accountTypes = getTableData('AccountTypes');
  const accountNatures = getTableData('AccountNature');
  const accountLevels = getTableData('AccountLevels');
  const accountCategories = getTableData('AccountCategories');
  const journalLines = getTableData('JournalEntryLines');
  const balances = getTableData('AccountBalances');

  // Build recursive tree
  const tree = useMemo(() => {
    const map = new Map<number, AccountNode>();
    accounts.forEach(acc => {
      map.set(acc.AccountId, { account: acc, children: [] });
    });

    const roots: AccountNode[] = [];
    accounts.forEach(acc => {
      const node = map.get(acc.AccountId)!;
      if (acc.ParentAccountId && map.has(acc.ParentAccountId)) {
        map.get(acc.ParentAccountId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort by code
    const sortNodes = (nodes: AccountNode[]) => {
      nodes.sort((a, b) => String(a.account.AccountCode).localeCompare(String(b.account.AccountCode), undefined, { numeric: true }));
      nodes.forEach(n => sortNodes(n.children));
    };
    sortNodes(roots);
    return roots;
  }, [accounts]);

  // Filtered accounts matching search term or type
  const isMatch = (acc: any): boolean => {
    if (selectedTypeFilter !== 'all' && acc.AccountTypeId !== selectedTypeFilter) return false;
    if (filterPostingOnly && !acc.IsPostingAllowed) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(acc.AccountCode).toLowerCase().includes(term) ||
      String(acc.AccountNameAr).toLowerCase().includes(term) ||
      String(acc.AccountNameEn).toLowerCase().includes(term)
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    accounts.forEach(a => allIds.add(a.AccountId));
    setExpandedNodeIds(allIds);
  };

  const collapseAll = () => {
    setExpandedNodeIds(new Set());
  };

  // Selected account object & details
  const selectedAccount = useMemo(() => {
    return accounts.find(a => a.AccountId === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Build breadcrumb trail
  const breadcrumbPath = useMemo(() => {
    if (!selectedAccount) return [];
    const path: any[] = [];
    let current: any = selectedAccount;
    const visited = new Set<number>();
    while (current && !visited.has(current.AccountId)) {
      path.unshift(current);
      visited.add(current.AccountId);
      current = accounts.find(a => a.AccountId === current.ParentAccountId);
    }
    return path;
  }, [selectedAccount, accounts]);

  // Handle delete with validation
  const handleDelete = (acc: any) => {
    const validation = canDeleteAccount(acc.AccountId, accounts, journalLines, balances);
    if (!validation.isValid) {
      showNotification(validation.errors[0], 'error');
      return;
    }
    if (confirm(language === 'ar' ? `هل أنت متأكد من حذف الحساب "${acc.AccountNameAr}"؟` : `Are you sure you want to delete "${acc.AccountNameEn}"?`)) {
      deleteRecord('ChartOfAccounts', acc.AccountId);
      showNotification(language === 'ar' ? 'تم حذف الحساب بنجاح' : 'Account deleted successfully', 'success');
      if (selectedAccountId === acc.AccountId) {
        setSelectedAccountId(null);
      }
    }
  };

  // Toggle active status
  const handleToggleActive = (acc: any) => {
    updateRecord('ChartOfAccounts', acc.AccountId, { IsActive: !acc.IsActive });
    showNotification(
      language === 'ar'
        ? `تم ${acc.IsActive ? 'تعطيل' : 'تفعيل'} الحساب ${acc.AccountNameAr}`
        : `Account ${acc.AccountNameEn} ${acc.IsActive ? 'deactivated' : 'activated'}`,
      'success'
    );
  };

  // Render a tree branch recursively
  const renderNode = (node: AccountNode, depth: number = 0) => {
    const acc = node.account;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodeIds.has(acc.AccountId);
    const isSelected = selectedAccountId === acc.AccountId;
    const matches = isMatch(acc);

    // If search is active and this node doesn't match and none of its descendants match, don't show
    const anyChildMatches = (n: AccountNode): boolean => {
      if (isMatch(n.account)) return true;
      return n.children.some(anyChildMatches);
    };

    if (searchTerm && !matches && !anyChildMatches(node)) {
      return null;
    }

    const typeObj = accountTypes.find(t => t.AccountTypeId === acc.AccountTypeId);
    const natureObj = accountNatures.find(n => n.AccountNatureId === acc.AccountNatureId);
    const levelObj = accountLevels.find(l => l.AccountLevelId === acc.AccountLevelId);

    return (
      <div key={acc.AccountId} className="select-none">
        <div
          onClick={() => setSelectedAccountId(acc.AccountId)}
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group mb-1 ${
            isSelected
              ? 'bg-blue-600/20 border border-blue-500/50 text-white shadow-sm'
              : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
          }`}
          style={{ paddingInlineStart: `${Math.max(12, depth * 22)}px` }}
        >
          {/* Left section: expand icon, folder/leaf icon, code, names */}
          <div className="flex items-center gap-2 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(acc.AccountId);
                }}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-700/60 text-slate-400 hover:text-white"
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-slate-600">
                •
              </span>
            )}

            {acc.IsParent ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-400 shrink-0" />
              )
            ) : (
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${acc.IsActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            )}

            <span className="font-mono font-bold text-blue-400 text-xs px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/50 shrink-0">
              {acc.AccountCode}
            </span>

            <span className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
              {language === 'ar' ? acc.AccountNameAr : acc.AccountNameEn}
            </span>

            {language === 'ar' && acc.AccountNameEn && (
              <span className="text-[11px] text-slate-400 hidden xl:inline truncate">
                ({acc.AccountNameEn})
              </span>
            )}
          </div>

          {/* Right section: badges and hover actions */}
          <div className="flex items-center gap-2 shrink-0">
            {natureObj && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                natureObj.NatureCode === 'DR'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              }`}>
                {natureObj.NatureCode}
              </span>
            )}

            {hasChildren && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {node.children.length}
              </span>
            )}

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalPayload({ parentId: acc.AccountId, parentCode: acc.AccountCode, mode: 'add' });
                  setActiveModal('addAccount');
                }}
                className="p-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white"
                title={language === 'ar' ? 'إضافة حساب فرعي تحته' : 'Add Sub Account'}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalPayload({ account: acc, mode: 'edit' });
                  setActiveModal('addAccount');
                }}
                className="p-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
                title={t('edit')}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(acc);
                }}
                className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white"
                title={t('delete')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Render child nodes if expanded */}
        {hasChildren && isExpanded && (
          <div className="border-s border-slate-800/80 ms-4 ps-1">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Master Account Button */}
          <button
            onClick={() => {
              setModalPayload({ parentId: null, mode: 'add' });
              setActiveModal('addAccount');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة حساب رئيسي عام' : 'Add Root Master Account'}</span>
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={expandAll}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            {t('expandAll')}
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            {t('collapseAll')}
          </button>

          {/* Filter by Type */}
          <div className="flex items-center gap-1.5 ms-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{language === 'ar' ? 'كافة أنواع الحسابات' : 'All Account Types'}</option>
              {accountTypes.map(t => (
                <option key={t.AccountTypeId} value={t.AccountTypeId}>
                  {language === 'ar' ? t.TypeNameAr : t.TypeNameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Posting Only Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer ms-2">
            <input
              type="checkbox"
              checked={filterPostingOnly}
              onChange={e => setFilterPostingOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>{language === 'ar' ? 'الحسابات التي تسمح بالترحيل فقط' : 'Posting accounts only'}</span>
          </label>
        </div>

        {/* Accounts Count Metric */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            {language === 'ar' ? 'الحسابات النشطة:' : 'Active Accounts:'} <strong className="text-white">{accounts.length}</strong>
          </span>
          <span className="text-slate-400">
            {language === 'ar' ? 'تسمح بالترحيل:' : 'Posting Allowed:'} <strong className="text-emerald-400">{accounts.filter(a => a.IsPostingAllowed).length}</strong>
          </span>
        </div>
      </div>

      {/* Main Split: Tree Explorer (Left) & Account Details Drawer (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-hidden">
        {/* Left: Interactive Tree */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'ar' ? 'الهيكل الهرمي لشجرة الحسابات' : 'Hierarchical Accounts Explorer'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              {language === 'ar' ? 'انقر على أي حساب لعرض تفاصيله' : 'Click account to inspect details'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pe-2 space-y-0.5">
            {tree.map(node => renderNode(node, 0))}
          </div>
        </div>

        {/* Right: Account Inspector & Details Drawer */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
          {selectedAccount ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black font-mono text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60">
                    {selectedAccount.AccountCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedAccount.IsActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {selectedAccount.IsActive ? t('isActive') : (language === 'ar' ? 'معطل' : 'Inactive')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      selectedAccount.IsPostingAllowed ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {selectedAccount.IsPostingAllowed ? (language === 'ar' ? 'يقبل الترحيل' : 'Posting') : (language === 'ar' ? 'تجميعي' : 'Header')}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">
                  {language === 'ar' ? selectedAccount.AccountNameAr : selectedAccount.AccountNameEn}
                </h3>
                {language === 'ar' && selectedAccount.AccountNameEn && (
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedAccount.AccountNameEn}
                  </p>
                )}
              </div>

              {/* Breadcrumb Trail */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المسار الهرمي للحساب' : 'Hierarchical Breadcrumb'}
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                  {breadcrumbPath.map((item, index) => (
                    <React.Fragment key={item.AccountId}>
                      {index > 0 && <span className="text-slate-600">/</span>}
                      <span className={`font-mono ${item.AccountId === selectedAccount.AccountId ? 'text-blue-400 font-bold' : 'text-slate-400'}`}>
                        {item.AccountCode}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Attributes Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('accountType')}</span>
                  <span className="font-semibold text-white">
                    {accountTypes.find(t => t.AccountTypeId === selectedAccount.AccountTypeId)?.[language === 'ar' ? 'TypeNameAr' : 'TypeNameEn'] || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('accountNature')}</span>
                  <span className="font-semibold text-white">
                    {accountNatures.find(n => n.AccountNatureId === selectedAccount.AccountNatureId)?.[language === 'ar' ? 'NatureNameAr' : 'NatureNameEn'] || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('accountLevel')}</span>
                  <span className="font-semibold text-white">
                    {accountLevels.find(l => l.AccountLevelId === selectedAccount.AccountLevelId)?.[language === 'ar' ? 'LevelNameAr' : 'LevelNameEn'] || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('accountCategory')}</span>
                  <span className="font-semibold text-white truncate block">
                    {accountCategories.find(c => c.AccountCategoryId === selectedAccount.AccountCategoryId)?.[language === 'ar' ? 'CategoryNameAr' : 'CategoryNameEn'] || (language === 'ar' ? 'عام' : 'General')}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selectedAccount.Description && (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-1">{language === 'ar' ? 'وصف وإرشادات الحساب:' : 'Description:'}</span>
                  <p className="text-slate-300 leading-relaxed">{selectedAccount.Description}</p>
                </div>
              )}

              {/* Linked Journal Entries count */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-300">{language === 'ar' ? 'حركات القيود اليومية المرتبطة' : 'Linked Journal Lines'}</span>
                <span className="font-mono font-bold text-indigo-400">
                  {journalLines.filter(l => l.AccountId === selectedAccount.AccountId).length} {language === 'ar' ? 'سطر' : 'lines'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setModalPayload({ parentId: selectedAccount.AccountId, parentCode: selectedAccount.AccountCode, mode: 'add' });
                      setActiveModal('addAccount');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة حساب فرعي' : 'Add Child'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setModalPayload({ account: selectedAccount, mode: 'edit' });
                      setActiveModal('addAccount');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t('edit')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(selectedAccount)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80"
                  >
                    {selectedAccount.IsActive ? (language === 'ar' ? 'تعطيل الحساب' : 'Deactivate') : (language === 'ar' ? 'تفعيل الحساب' : 'Activate')}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedAccount)}
                    className="py-1.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-medium border border-rose-800/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              {language === 'ar' ? 'اختر حساباً من الشجرة لاستعراض تفاصيله' : 'Select an account from tree to inspect'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
