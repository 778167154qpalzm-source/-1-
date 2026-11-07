import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMAS } from '../../db/schema';
import { 
  exportProjectData, 
  importProjectData, 
  generateSqlDdl, 
  resetDatabase, 
  getAllTablesData 
} from '../../db/storage';
import { 
  HardDriveDownload, 
  FileJson, 
  FileCode2, 
  RotateCcw, 
  Copy, 
  Check, 
  Upload, 
  Database,
  AlertTriangle,
  HardDrive
} from 'lucide-react';

export const DataManagerView: React.FC = () => {
  const { t, language, showNotification, setActiveModal, dbVersion } = useApp();
  const [copiedType, setCopiedType] = useState<'json' | 'sql' | null>(null);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'export_json' | 'export_sql' | 'import' | 'metrics'>('export_json');

  const allTables = getAllTablesData();

  // Calculate local storage size
  const storageMetrics = useMemo(() => {
    let totalBytes = 0;
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('accounting_db_')) {
          const val = localStorage.getItem(key) || '';
          totalBytes += key.length + val.length;
        }
      }
    }
    const kb = (totalBytes / 1024).toFixed(2);
    const totalRecords = Object.values(allTables).reduce((acc, rows) => acc + rows.length, 0);
    return { kb, totalRecords };
  }, [allTables, dbVersion]);

  // Handle Download JSON
  const handleDownloadJson = () => {
    const jsonStr = exportProjectData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounting-database-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(language === 'ar' ? 'تم تنزيل ملف JSON بنجاح' : 'JSON file downloaded', 'success');
  };

  // Handle Download SQL
  const handleDownloadSql = () => {
    const sqlStr = generateSqlDdl();
    const blob = new Blob([sqlStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounting-schema-ddl-${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(language === 'ar' ? 'تم تنزيل سكربت SQL بنجاح' : 'SQL DDL script downloaded', 'success');
  };

  // Copy to clipboard
  const handleCopy = (type: 'json' | 'sql') => {
    const text = type === 'json' ? exportProjectData() : generateSqlDdl();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showNotification(language === 'ar' ? 'تم النسخ إلى الحافظة' : 'Copied to clipboard', 'info');
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Handle Import
  const handleProcessImport = () => {
    if (!importJsonText.trim()) {
      showNotification(language === 'ar' ? 'يرجى لصق كود JSON أو تحميل ملف' : 'Please paste JSON content', 'error');
      return;
    }
    const res = importProjectData(importJsonText);
    if (res.success) {
      showNotification(res.message, 'success');
      setImportJsonText('');
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HardDriveDownload className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'إدارة وتصدير بيانات المشروع' : 'Data Management & Export'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar'
              ? 'تصدير واستيراد البيانات بصيغة JSON، توليد سكربتات SQL DDL، ومراقبة مساحة التخزين المحلي'
              : 'Export/import JSON database snapshots, generate SQL DDL schema, and monitor LocalStorage usage'}
          </p>
        </div>

        <button
          onClick={() => setActiveModal('resetConfirm')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>{t('resetData')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('export_json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'export_json'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileJson className="w-4 h-4 text-emerald-400" />
          <span>{t('jsonExport')}</span>
        </button>

        <button
          onClick={() => setActiveTab('export_sql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'export_sql'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-indigo-400" />
          <span>{t('sqlExport')}</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'import'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>{t('importData')}</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'metrics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>{language === 'ar' ? 'مساحة التخزين' : 'Storage Metrics'}</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {/* 1. Export JSON */}
      {activeTab === 'export_json' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'تصدير كامل قاعدة البيانات وشجرة الحسابات (JSON)' : 'Export Full Accounting Database (JSON)'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'يتضمن المخطط، الحقول، العلاقات، إحداثيات ومواقع الجداول، وكافة سجلات الجداول الـ18'
                  : 'Includes schemas, relationships, ERD coordinates, and all table records'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('json')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                {copiedType === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'json' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تنزيل ملف .json' : 'Download .json'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-300 max-h-96 overflow-y-auto border border-slate-800 leading-relaxed">
            {exportProjectData()}
          </pre>
        </div>
      )}

      {/* 2. Export SQL */}
      {activeTab === 'export_sql' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <span>{language === 'ar' ? 'توليد كود إنشاء الجداول القياسي (SQL DDL)' : 'Generated Standard SQL DDL Schema Script'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'سكربت متوافق مع معايير SQL ANSI لإنشاء الجداول الـ18 مع المفاتيح الأساسية والقيود والمفاتيح الأجنبية'
                  : 'ANSI SQL script for creating all 18 tables with primary keys, constraints, and foreign keys'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('sql')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                {copiedType === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'sql' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
              </button>
              <button
                onClick={handleDownloadSql}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تنزيل ملف .sql' : 'Download .sql'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-blue-300 max-h-96 overflow-y-auto border border-slate-800 leading-relaxed">
            {generateSqlDdl()}
          </pre>
        </div>
      )}

      {/* 3. Import JSON */}
      {activeTab === 'import' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'استيراد نسخة بيانات JSON سابقة' : 'Import JSON Database Snapshot'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'الصق كود JSON أو ارفع ملفاً تم تصديره مسبقاً لاستبدال البيانات الحالية'
                : 'Paste JSON or upload an exported backup file to restore application state'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'اختيار ملف من جهازك...' : 'Choose File...'}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            value={importJsonText}
            onChange={e => setImportJsonText(e.target.value)}
            rows={8}
            placeholder={language === 'ar' ? 'الصق محتوى ملف JSON هنا...' : 'Paste JSON content here...'}
            className="w-full bg-slate-950 text-xs font-mono text-emerald-300 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleProcessImport}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            {language === 'ar' ? 'بدء استيراد وتطبيق البيانات' : 'Apply Imported Data'}
          </button>
        </div>
      )}

      {/* 4. Storage Metrics */}
      {activeTab === 'metrics' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>{language === 'ar' ? 'إحصائيات استهلاك التخزين المحلي (LocalStorage)' : 'LocalStorage Usage & Record Breakdown'}</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40">
              {storageMetrics.kb} KB Used / {storageMetrics.totalRecords} Total Records
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SCHEMAS.map(schema => {
              const count = allTables[schema.name]?.length || 0;
              return (
                <div key={schema.name} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <span className="font-mono font-bold text-white block truncate">{schema.name}</span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {language === 'ar' ? schema.nameAr : schema.nameEn}
                  </span>
                  <span className="text-indigo-400 font-mono font-bold block">
                    {count} {t('recordsCount')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
