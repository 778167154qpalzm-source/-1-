import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMAS, TABLE_GROUPS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';
import { getTableData, deleteRecord } from '../../db/storage';
import { 
  Table2, 
  FileText, 
  Database, 
  Key, 
  Link2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const TableDetailsView: React.FC = () => {
  const { 
    selectedTable, 
    setSelectedTable, 
    tableSubView, 
    setTableSubView, 
    language, 
    t, 
    setActiveModal, 
    setModalPayload,
    showNotification,
    setCurrentView,
    dbVersion 
  } = useApp();

  const [rowSearch, setRowSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const schema = SCHEMAS.find(s => s.name === selectedTable) || SCHEMAS[0];
  const group = TABLE_GROUPS.find(g => g.id === schema.groupId);
  const records = getTableData(schema.name);

  // Filter records
  const filteredRecords = useMemo(() => {
    if (!rowSearch) return records;
    const q = rowSearch.toLowerCase();
    return records.filter(row => {
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(q)
      );
    });
  }, [records, rowSearch]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  // Outgoing & incoming relationships
  const outgoingRels = RELATIONSHIPS.filter(r => r.sourceTable === schema.name);
  const incomingRels = RELATIONSHIPS.filter(r => r.targetTable === schema.name);

  // Handle delete row
  const handleDeleteRow = (idVal: any) => {
    if (confirm(language === 'ar' ? `هل أنت متأكد من حذف السجل رقم ${idVal} من جدول ${schema.nameAr}؟` : `Delete record #${idVal} from ${schema.name}?`)) {
      const ok = deleteRecord(schema.name, idVal);
      if (ok) {
        showNotification(language === 'ar' ? 'تم حذف السجل بنجاح' : 'Record deleted successfully', 'success');
      } else {
        showNotification(language === 'ar' ? 'فشل حذف السجل' : 'Failed to delete record', 'error');
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Table Selector & Subview Switcher */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">
            {language === 'ar' ? 'اختيار الجدول:' : 'Select Table:'}
          </label>
          <select
            value={selectedTable}
            onChange={e => {
              setSelectedTable(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-800 text-xs font-bold text-white rounded-xl px-3.5 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {SCHEMAS.map(s => (
              <option key={s.name} value={s.name}>
                {s.name} ({language === 'ar' ? s.nameAr : s.nameEn})
              </option>
            ))}
          </select>

          {/* SubView Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 ms-2">
            <button
              onClick={() => setTableSubView('structure')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tableSubView === 'structure'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('structureView')}</span>
            </button>
            <button
              onClick={() => setTableSubView('data')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tableSubView === 'data'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{t('dataView')}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {records.length}
              </span>
            </button>
          </div>
        </div>

        {/* Action Button for adding record */}
        <button
          onClick={() => {
            setModalPayload({ tableName: schema.name, mode: 'add' });
            setActiveModal('addRecord');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ar' ? `إضافة سجل في ${schema.nameAr}` : `Add Record to ${schema.name}`}</span>
        </button>
      </div>

      {/* Table Metadata Header Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black font-mono text-white tracking-tight">
              {schema.name}
            </h1>
            <span className="text-sm font-semibold text-slate-300">
              ({language === 'ar' ? schema.nameAr : schema.nameEn})
            </span>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/40">
              {language === 'ar' ? group?.nameAr : group?.nameEn}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>PK: <strong className="text-amber-400">{schema.primaryKey}</strong></span>
            <span>{schema.columns.length} {t('fieldsCount')}</span>
            <span>{records.length} {t('recordsCount')}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          {language === 'ar' ? schema.descriptionAr : schema.descriptionEn}
        </p>
      </div>

      {/* VIEW 1: STRUCTURE VIEW */}
      {tableSubView === 'structure' && (
        <div className="space-y-6">
          {/* Columns Schema Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{language === 'ar' ? 'تعريف حقول الجدول وأنواع البيانات والقيود' : 'Columns Schema, Data Types & Constraints'}</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'اسم الحقل' : 'Column Name'}</th>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'نوع البيانات' : 'Data Type'}</th>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'المفتاح' : 'Key'}</th>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'NULL؟' : 'Nullable'}</th>
                    <th className="py-3 px-4 text-start">{t('defaultVal')}</th>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'الجدول المرتبط' : 'Foreign Reference'}</th>
                    <th className="py-3 px-4 text-start">{language === 'ar' ? 'الوصف' : 'Description'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {schema.columns.map(col => (
                    <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        {col.isPrimary && <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {col.isForeign && <Link2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="py-3 px-4 text-indigo-400 font-semibold">
                        {col.type}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {col.isPrimary ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            PK
                          </span>
                        ) : col.isForeign ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            FK
                          </span>
                        ) : col.isUnique ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            UQ
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {col.isNullable ? (
                          <span className="text-slate-400">{t('nullable')}</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">{t('notNull')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {col.defaultValue !== undefined ? String(col.defaultValue) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sky-300">
                        {col.foreignRef ? (
                          <button
                            onClick={() => setSelectedTable(col.foreignRef!.table)}
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>{col.foreignRef.table}.{col.foreignRef.column}</span>
                            <ExternalLink className="w-3 h-3 text-sky-400" />
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                        {language === 'ar' ? col.descriptionAr : col.descriptionEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Relationships Matrix for this table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Outgoing */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-sky-400" />
                <span>{t('outgoingRelations')} ({outgoingRels.length})</span>
              </h4>
              {outgoingRels.length > 0 ? (
                <div className="space-y-2">
                  {outgoingRels.map(rel => (
                    <div key={rel.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-amber-300 font-bold">{rel.sourceColumn}</span>
                        <span className="text-slate-500">⟶</span>
                        <button
                          onClick={() => setSelectedTable(rel.targetTable)}
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          {rel.targetTable}.{rel.targetColumn}
                        </button>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                          {rel.cardinality}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{language === 'ar' ? rel.labelAr : rel.labelEn}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3">{language === 'ar' ? 'لا توجد علاقات صادرة من هذا الجدول' : 'No outgoing relations'}</p>
              )}
            </div>

            {/* Incoming */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <span>{t('incomingRelations')} ({incomingRels.length})</span>
              </h4>
              {incomingRels.length > 0 ? (
                <div className="space-y-2">
                  {incomingRels.map(rel => (
                    <div key={rel.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <button
                          onClick={() => setSelectedTable(rel.sourceTable)}
                          className="text-amber-400 font-bold hover:underline"
                        >
                          {rel.sourceTable}.{rel.sourceColumn}
                        </button>
                        <span className="text-slate-500">⟶</span>
                        <span className="text-emerald-300 font-bold">{rel.targetColumn}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                          {rel.cardinality}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{language === 'ar' ? rel.labelAr : rel.labelEn}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3">{language === 'ar' ? 'لا توجد جداول تشير إلى هذا الجدول كـ FK' : 'No incoming relations'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DATA VIEW */}
      {tableSubView === 'data' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg space-y-3">
          {/* Top Filter and Actions */}
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rowSearch}
                onChange={e => {
                  setRowSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={language === 'ar' ? 'بحث في السجلات...' : 'Filter records...'}
                className="w-full bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl ps-9 pe-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {filteredRecords.length} {t('recordsCount')} {filteredRecords.length !== records.length && `(من إجمالي ${records.length})`}
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  {schema.columns.map(col => (
                    <th key={col.name} className="py-3 px-4 text-start font-mono whitespace-nowrap">
                      {col.name}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center whitespace-nowrap">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((row, index) => {
                    const pkVal = row[schema.primaryKey];
                    return (
                      <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                        {schema.columns.map(col => {
                          const val = row[col.name];
                          return (
                            <td key={col.name} className="py-2.5 px-4 text-slate-200 max-w-xs truncate whitespace-nowrap">
                              {typeof val === 'boolean' ? (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  val ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                  {val ? 'TRUE' : 'FALSE'}
                                </span>
                              ) : val === null || val === undefined ? (
                                <span className="text-slate-600">NULL</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setModalPayload({ tableName: schema.name, record: row, mode: 'edit' });
                                setActiveModal('addRecord');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all"
                              title={t('edit')}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(pkVal)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all"
                              title={t('delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={schema.columns.length + 1} className="py-8 text-center text-slate-500 font-sans">
                      {t('noRecords')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                {language === 'ar' ? `الصفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
