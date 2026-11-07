import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMAS, TABLE_GROUPS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';
import { getTableData } from '../../db/storage';
import { TableSchema, TableGroupId } from '../../types';
import { 
  Table2, 
  Layers, 
  ArrowRight, 
  Key, 
  Link2, 
  Database, 
  Filter, 
  PlusCircle, 
  FileText 
} from 'lucide-react';

export const TablesListView: React.FC = () => {
  const { t, language, setSelectedTable, setCurrentView, setTableSubView, setActiveModal, setModalPayload } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<TableGroupId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSchemas = SCHEMAS.filter(schema => {
    if (selectedGroup !== 'all' && schema.groupId !== selectedGroup) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        schema.name.toLowerCase().includes(q) ||
        schema.nameAr.toLowerCase().includes(q) ||
        schema.nameEn.toLowerCase().includes(q) ||
        schema.descriptionAr.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Table2 className="w-5 h-5 text-blue-400" />
            <span>{language === 'ar' ? 'جميع الجداول المحاسبية الـ18' : 'All 18 Accounting Tables'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'استعرض بنية الجداول، المفاتيح الأساسية والأجنبية، وسجلات البيانات المخزنة محلياً'
              : 'Inspect table structures, primary and foreign keys, and local data records'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value as any)}
            className="bg-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'ar' ? 'كافة المجموعات' : 'All Groups'}</option>
            {TABLE_GROUPS.map(g => (
              <option key={g.id} value={g.id}>
                {language === 'ar' ? g.nameAr : g.nameEn}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث باسم الجدول أو الوصف...' : 'Search table...'}
            className="bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl px-3.5 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemas.map(schema => {
          const group = TABLE_GROUPS.find(g => g.id === schema.groupId);
          const records = getTableData(schema.name);
          const pkCol = schema.columns.find(c => c.isPrimary);
          const fkCols = schema.columns.filter(c => c.isForeign);
          const outgoingCount = RELATIONSHIPS.filter(r => r.sourceTable === schema.name).length;
          const incomingCount = RELATIONSHIPS.filter(r => r.targetTable === schema.name).length;

          return (
            <div
              key={schema.name}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                      {schema.name}
                    </span>
                    <h3 className="text-xs font-semibold text-slate-300">
                      {language === 'ar' ? schema.nameAr : schema.nameEn}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {records.length} {t('recordsCount')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {language === 'ar' ? schema.descriptionAr : schema.descriptionEn}
                </p>

                {/* Key attributes info */}
                <div dir="ltr" className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3">
                  <div className="flex items-center gap-1.5 text-amber-400 min-w-0">
                    <Key className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-slate-400">PK:</span>
                    <span className="font-bold truncate" title={pkCol?.name}>{pkCol?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-400">
                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-slate-400">FKs:</span>
                    <span className="font-bold">{fkCols.length}</span>
                  </div>
                  <div className="text-slate-400">
                    <span>{schema.columns.length} {t('fieldsCount')}</span>
                  </div>
                  <div className="text-slate-400">
                    <span>{outgoingCount + incomingCount} {t('totalRelations')}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setSelectedTable(schema.name);
                    setTableSubView('structure');
                    setCurrentView('table-details');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('structureView')}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedTable(schema.name);
                    setTableSubView('data');
                    setCurrentView('table-details');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{t('dataView')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
