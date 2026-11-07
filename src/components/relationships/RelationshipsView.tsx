import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RELATIONSHIPS } from '../../db/relationships';
import { SCHEMAS } from '../../db/schema';
import { RelationType } from '../../types';
import { 
  GitMerge, 
  Search, 
  Filter, 
  ExternalLink, 
  Layers, 
  ArrowRight,
  Database
} from 'lucide-react';

export const RelationshipsView: React.FC = () => {
  const { t, language, setSelectedTable, setCurrentView } = useApp();
  const [filterType, setFilterType] = useState<RelationType | 'all'>('all');
  const [filterCardinality, setFilterCardinality] = useState<'1:1' | '1:N' | 'N:M' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRelations = RELATIONSHIPS.filter(rel => {
    if (filterType !== 'all' && rel.type !== filterType) return false;
    if (filterCardinality !== 'all' && rel.cardinality !== filterCardinality) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        rel.sourceTable.toLowerCase().includes(q) ||
        rel.targetTable.toLowerCase().includes(q) ||
        rel.sourceColumn.toLowerCase().includes(q) ||
        rel.targetColumn.toLowerCase().includes(q) ||
        rel.labelAr.toLowerCase().includes(q) ||
        rel.labelEn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-indigo-400" />
            <span>{language === 'ar' ? 'سجل العلاقات والروابط المحاسبية (30 علاقة)' : 'Database Relationships Matrix (30 Relations)'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'مصفوفة كاملة لكافة المفاتيح الأجنبية، والعلاقات الهرمية الذاتية، وعلاقات متعدد إلى متعدد (N:M)'
              : 'Comprehensive matrix of foreign keys, self-referencing trees, and junction M:N links'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCardinality}
            onChange={e => setFilterCardinality(e.target.value as any)}
            className="bg-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'ar' ? 'كافة الرتب (Cardinality)' : 'All Cardinalities'}</option>
            <option value="1:1">One-to-One (1:1)</option>
            <option value="1:N">One-to-Many (1:N)</option>
            <option value="N:M">Many-to-Many (N:M)</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في الجداول أو الحقول...' : 'Search relations...'}
            className="bg-slate-800 text-xs text-white placeholder-slate-400 rounded-xl px-3.5 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Relations Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الجدول والحقل المصدر (FK)' : 'Source (FK)'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الرتبة والنوع' : 'Cardinality'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الجدول والحقل الهدف (PK)' : 'Target (PK)'}</th>
                <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'وصف طبيعة العلاقة المحاسبية' : 'Description'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'إجراء' : 'Inspect'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRelations.map(rel => {
                return (
                  <tr key={rel.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Source */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedTable(rel.sourceTable);
                            setCurrentView('table-details');
                          }}
                          className="font-bold text-sky-400 hover:underline"
                        >
                          {rel.sourceTable}
                        </button>
                        <span className="text-slate-500">.</span>
                        <span className="text-amber-300 font-semibold">{rel.sourceColumn}</span>
                      </div>
                    </td>

                    {/* Cardinality Badge */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rel.cardinality === 'N:M'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : rel.isSelfReferential
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {rel.cardinality} {rel.isSelfReferential ? '(Self)' : ''}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedTable(rel.targetTable);
                            setCurrentView('table-details');
                          }}
                          className="font-bold text-emerald-400 hover:underline"
                        >
                          {rel.targetTable}
                        </button>
                        <span className="text-slate-500">.</span>
                        <span className="text-amber-300 font-semibold">{rel.targetColumn}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                      {language === 'ar' ? rel.labelAr : rel.labelEn}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedTable(rel.sourceTable);
                          setCurrentView('table-details');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                        title={language === 'ar' ? 'عرض الجدول' : 'View Table'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
