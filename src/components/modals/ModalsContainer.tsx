import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMAS } from '../../db/schema';
import { 
  getTableData, 
  addRecord, 
  updateRecord, 
  resetDatabase,
  exportProjectData,
  generateSqlDdl 
} from '../../db/storage';
import { validateChartOfAccount } from '../../db/validation';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  FileCode2,
  HardDriveDownload
} from 'lucide-react';

export const ModalsContainer: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    modalPayload, 
    notifications, 
    showNotification, 
    language, 
    t 
  } = useApp();

  // --- 1. Add / Edit Account Form State ---
  const [accountForm, setAccountForm] = useState<any>({
    CompanyId: 1,
    AccountCode: '',
    AccountNameAr: '',
    AccountNameEn: '',
    ParentAccountId: null,
    AccountTypeId: 1,
    AccountNatureId: 1,
    AccountLevelId: 4,
    AccountCategoryId: 1,
    IsParent: false,
    IsPostingAllowed: true,
    IsActive: true,
    Description: ''
  });

  // --- 2. Generic Record Form State ---
  const [recordForm, setRecordForm] = useState<Record<string, any>>({});
  const [copiedType, setCopiedType] = useState<'json' | 'sql' | null>(null);

  const accounts = getTableData('ChartOfAccounts');
  const companies = getTableData('Companies');
  const accountTypes = getTableData('AccountTypes');
  const accountNatures = getTableData('AccountNature');
  const accountLevels = getTableData('AccountLevels');
  const accountCategories = getTableData('AccountCategories');

  // Populate forms when active modal opens
  useEffect(() => {
    if (activeModal === 'addAccount') {
      if (modalPayload?.mode === 'edit' && modalPayload?.account) {
        setAccountForm({ ...modalPayload.account });
      } else {
        const parentId = modalPayload?.parentId ?? null;
        let suggestedCode = '';
        if (parentId) {
          const parent = accounts.find(a => a.AccountId === parentId);
          if (parent) {
            // Find highest existing child code or append '01'
            const children = accounts.filter(a => a.ParentAccountId === parentId);
            if (children.length > 0) {
              const lastChild = children[children.length - 1];
              const lastNum = parseInt(lastChild.AccountCode.slice(-2)) || children.length;
              const nextNum = String(lastNum + 1).padStart(2, '0');
              suggestedCode = `${parent.AccountCode}${nextNum}`;
            } else {
              suggestedCode = `${parent.AccountCode}01`;
            }
          }
        }
        setAccountForm({
          CompanyId: 1,
          AccountCode: suggestedCode,
          AccountNameAr: '',
          AccountNameEn: '',
          ParentAccountId: parentId,
          AccountTypeId: parentId ? accounts.find(a => a.AccountId === parentId)?.AccountTypeId || 1 : 1,
          AccountNatureId: parentId ? accounts.find(a => a.AccountId === parentId)?.AccountNatureId || 1 : 1,
          AccountLevelId: parentId ? Math.min(5, (accounts.find(a => a.AccountId === parentId)?.AccountLevelId || 1) + 1) : 1,
          AccountCategoryId: parentId ? accounts.find(a => a.AccountId === parentId)?.AccountCategoryId || 1 : 1,
          IsParent: false,
          IsPostingAllowed: true,
          IsActive: true,
          Description: ''
        });
      }
    } else if (activeModal === 'addRecord') {
      if (modalPayload?.mode === 'edit' && modalPayload?.record) {
        setRecordForm({ ...modalPayload.record });
      } else {
        const schema = SCHEMAS.find(s => s.name === modalPayload?.tableName);
        const initialRecord: Record<string, any> = {};
        if (schema) {
          schema.columns.forEach(col => {
            if (!col.isPrimary) {
              if (col.defaultValue !== undefined) {
                initialRecord[col.name] = col.defaultValue === 'CURRENT_TIMESTAMP' ? new Date().toISOString().slice(0, 10) : col.defaultValue;
              } else if (col.type.startsWith('DECIMAL') || col.type.startsWith('INT')) {
                initialRecord[col.name] = 0;
              } else if (col.type === 'BOOLEAN') {
                initialRecord[col.name] = true;
              } else {
                initialRecord[col.name] = '';
              }
            }
          });
        }
        setRecordForm(initialRecord);
      }
    }
  }, [activeModal, modalPayload]);

  // Handle Account Form Submit
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateChartOfAccount(accountForm, accounts);
    if (!validation.isValid) {
      showNotification(validation.errors[0], 'error');
      return;
    }

    if (modalPayload?.mode === 'edit') {
      updateRecord('ChartOfAccounts', accountForm.AccountId, accountForm);
      showNotification(language === 'ar' ? 'تم تعديل الحساب بنجاح' : 'Account updated successfully', 'success');
    } else {
      addRecord('ChartOfAccounts', accountForm);
      showNotification(language === 'ar' ? 'تمت إضافة الحساب بنجاح إلى الشجرة' : 'Account added successfully', 'success');
    }
    setActiveModal(null);
  };

  // Handle Generic Record Submit
  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tableName = modalPayload?.tableName;
    if (!tableName) return;

    const schema = SCHEMAS.find(s => s.name === tableName);
    if (!schema) return;

    if (modalPayload?.mode === 'edit') {
      const pkVal = recordForm[schema.primaryKey];
      updateRecord(tableName, pkVal, recordForm);
      showNotification(language === 'ar' ? 'تم تعديل السجل بنجاح' : 'Record updated successfully', 'success');
    } else {
      addRecord(tableName, recordForm);
      showNotification(language === 'ar' ? 'تمت إضافة السجل بنجاح' : 'Record added successfully', 'success');
    }
    setActiveModal(null);
  };

  // Handle Reset Confirmation
  const handleResetConfirm = () => {
    resetDatabase();
    setActiveModal(null);
    showNotification(language === 'ar' ? 'تمت إعادة ضبط قاعدة البيانات إلى البيانات الافتراضية' : 'Database reset to default seed data', 'success');
  };

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`pointer-events-auto p-3.5 rounded-xl text-xs font-semibold shadow-xl border backdrop-blur flex items-center gap-2.5 transition-all animate-in slide-in-from-bottom-2 ${
              n.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
                : n.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-700/60'
                : 'bg-blue-950/90 text-blue-200 border-blue-700/60'
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="flex-1 leading-relaxed">{n.message}</span>
          </div>
        ))}
      </div>

      {/* --- MODAL 1: ADD / EDIT ACCOUNT --- */}
      {activeModal === 'addAccount' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{modalPayload?.mode === 'edit' ? t('edit') : t('addAccount')}</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAccountSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Account Code & Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountCode')} *</label>
                  <input
                    type="text"
                    required
                    value={accountForm.AccountCode}
                    onChange={e => setAccountForm({ ...accountForm, AccountCode: e.target.value })}
                    placeholder="e.g. 110105"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{language === 'ar' ? 'الشركة' : 'Company'} *</label>
                  <select
                    value={accountForm.CompanyId}
                    onChange={e => setAccountForm({ ...accountForm, CompanyId: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {companies.map(c => (
                      <option key={c.CompanyId} value={c.CompanyId}>
                        {c.CompanyCode} - {c.CompanyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountNameAr')} *</label>
                  <input
                    type="text"
                    required
                    value={accountForm.AccountNameAr}
                    onChange={e => setAccountForm({ ...accountForm, AccountNameAr: e.target.value })}
                    placeholder="مثال: حساب البنك العربي"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountNameEn')} *</label>
                  <input
                    type="text"
                    required
                    value={accountForm.AccountNameEn}
                    onChange={e => setAccountForm({ ...accountForm, AccountNameEn: e.target.value })}
                    placeholder="e.g. Arab Bank Account"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Parent Account Select */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{language === 'ar' ? 'الحساب الأب (Parent Account)' : 'Parent Account'}</label>
                <select
                  value={accountForm.ParentAccountId ?? ''}
                  onChange={e => setAccountForm({ ...accountForm, ParentAccountId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="">{language === 'ar' ? '-- بدون حساب أب (حساب رئيسي عام) --' : '-- No Parent (Root Account) --'}</option>
                  {accounts.filter(a => a.AccountId !== accountForm.AccountId).map(a => (
                    <option key={a.AccountId} value={a.AccountId}>
                      {a.AccountCode} - {language === 'ar' ? a.AccountNameAr : a.AccountNameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type, Nature, Level */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountType')}</label>
                  <select
                    value={accountForm.AccountTypeId}
                    onChange={e => setAccountForm({ ...accountForm, AccountTypeId: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {accountTypes.map(t => (
                      <option key={t.AccountTypeId} value={t.AccountTypeId}>
                        {language === 'ar' ? t.TypeNameAr : t.TypeNameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountNature')}</label>
                  <select
                    value={accountForm.AccountNatureId}
                    onChange={e => setAccountForm({ ...accountForm, AccountNatureId: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {accountNatures.map(n => (
                      <option key={n.AccountNatureId} value={n.AccountNatureId}>
                        {language === 'ar' ? n.NatureNameAr : n.NatureNameEn} ({n.NatureCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">{t('accountLevel')}</label>
                  <select
                    value={accountForm.AccountLevelId}
                    onChange={e => setAccountForm({ ...accountForm, AccountLevelId: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {accountLevels.map(l => (
                      <option key={l.AccountLevelId} value={l.AccountLevelId}>
                        {language === 'ar' ? l.LevelNameAr : l.LevelNameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes: IsParent, IsPostingAllowed, IsActive */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountForm.IsParent}
                    onChange={e => {
                      const isParent = e.target.checked;
                      setAccountForm({
                        ...accountForm,
                        IsParent: isParent,
                        // If parent, posting MUST be false
                        IsPostingAllowed: isParent ? false : accountForm.IsPostingAllowed
                      });
                    }}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white">{t('isParent')}</span>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'حساب رئيسي تجميعي يضم حسابات فرعية تحته' : 'Header account that groups sub-accounts'}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={accountForm.IsParent}
                    checked={accountForm.IsPostingAllowed}
                    onChange={e => setAccountForm({ ...accountForm, IsPostingAllowed: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 disabled:opacity-40"
                  />
                  <div>
                    <span className="font-semibold text-white">{t('isPostingAllowed')}</span>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'السماح باختيار الحساب في أسطر القيود اليومية' : 'Allows transactional posting in journal entries'}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accountForm.IsActive}
                    onChange={e => setAccountForm({ ...accountForm, IsActive: e.target.checked })}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white">{t('isActive')}</span>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'حالة نشاط وتفعيل الحساب بالنظام' : 'Active status of account in system'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">{language === 'ar' ? 'الوصف وملاحظات الاستخدام' : 'Description'}</label>
                <textarea
                  rows={2}
                  value={accountForm.Description || ''}
                  onChange={e => setAccountForm({ ...accountForm, Description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT GENERIC TABLE RECORD --- */}
      {activeModal === 'addRecord' && modalPayload?.tableName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {(() => {
              const schema = SCHEMAS.find(s => s.name === modalPayload.tableName)!;
              return (
                <>
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {modalPayload?.mode === 'edit' ? t('edit') : t('addTableRecord')}: {schema.name} ({language === 'ar' ? schema.nameAr : schema.nameEn})
                    </h3>
                    <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleRecordSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
                    {schema.columns.map(col => {
                      if (col.isPrimary && modalPayload?.mode === 'add') {
                        return null; // Auto-generated PK
                      }
                      const val = recordForm[col.name];

                      return (
                        <div key={col.name}>
                          <label className="text-slate-400 block mb-1 font-semibold flex items-center justify-between">
                            <span>{col.name} {!col.isNullable && <strong className="text-amber-400">*</strong>}</span>
                            <span className="text-[10px] font-mono text-slate-500">{col.type}</span>
                          </label>

                          {col.type === 'BOOLEAN' ? (
                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                              <input
                                type="checkbox"
                                checked={!!val}
                                onChange={e => setRecordForm({ ...recordForm, [col.name]: e.target.checked })}
                                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                              />
                              <span className="text-white font-mono">{val ? 'TRUE' : 'FALSE'}</span>
                            </label>
                          ) : col.type === 'TEXT' ? (
                            <textarea
                              rows={2}
                              value={val ?? ''}
                              onChange={e => setRecordForm({ ...recordForm, [col.name]: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          ) : col.type === 'DATE' ? (
                            <input
                              type="date"
                              required={!col.isNullable}
                              value={val ? String(val).slice(0, 10) : ''}
                              onChange={e => setRecordForm({ ...recordForm, [col.name]: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                            />
                          ) : col.type.startsWith('INT') || col.type.startsWith('DECIMAL') ? (
                            <input
                              type="number"
                              step={col.type.startsWith('DECIMAL') ? '0.01' : '1'}
                              required={!col.isNullable}
                              disabled={col.isPrimary && modalPayload?.mode === 'edit'}
                              value={val ?? ''}
                              onChange={e => setRecordForm({ ...recordForm, [col.name]: Number(e.target.value) })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 disabled:opacity-50"
                            />
                          ) : (
                            <input
                              type="text"
                              required={!col.isNullable}
                              value={val ?? ''}
                              onChange={e => setRecordForm({ ...recordForm, [col.name]: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                      >
                        {t('save')}
                      </button>
                    </div>
                  </form>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* --- MODAL 3: RESET CONFIRMATION --- */}
      {activeModal === 'resetConfirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {language === 'ar' ? 'تأكيد إعادة ضبط قاعدة البيانات' : 'Confirm Database Reset'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar'
                  ? 'سيتم مسح كافة التعديلات والتغييرات وإعادة تعيين الجداول الـ18 وشجرة الحسابات إلى البيانات التجريبية الافتراضية.'
                  : 'All changes will be reverted back to initial pristine seed data for all 18 tables.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                {language === 'ar' ? 'نعم، أعد الضبط' : 'Yes, Reset Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: QUICK EXPORT MODAL --- */}
      {activeModal === 'export' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDriveDownload className="w-4 h-4 text-emerald-400" />
                <span>{t('exportData')}</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* JSON Download */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{t('jsonExport')}</span>
                  <span className="text-[11px] text-slate-400">كامل الجداول والسجلات ومخطط ERD</span>
                </div>
                <button
                  onClick={() => {
                    const jsonStr = exportProjectData();
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `accounting-db-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    showNotification(language === 'ar' ? 'تم تنزيل ملف JSON' : 'JSON downloaded', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SQL Download */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{t('sqlExport')}</span>
                  <span className="text-[11px] text-slate-400">سكربت SQL DDL لإنشاء الجداول</span>
                </div>
                <button
                  onClick={() => {
                    const sqlStr = generateSqlDdl();
                    const blob = new Blob([sqlStr], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `accounting-ddl-${new Date().toISOString().slice(0, 10)}.sql`;
                    a.click();
                    showNotification(language === 'ar' ? 'تم تنزيل ملف SQL' : 'SQL downloaded', 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
