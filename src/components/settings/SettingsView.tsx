import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Languages, 
  Database, 
  Github, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { SCHEMAS } from '../../db/schema';
import { RELATIONSHIPS } from '../../db/relationships';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t, dbVersion } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          <span>{t('settings')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {language === 'ar'
            ? 'خيارات اللغة، إرشادات النشر على GitHub Pages، وتفاصيل البنية الهندسية'
            : 'Language preferences, GitHub Pages deployment guide, and architectural specifications'}
        </p>
      </div>

      {/* Language Preference Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-400" />
          <span>{language === 'ar' ? 'لغة الواجهة واتجاه النص' : 'Interface Language & Text Direction'}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'يدعم النظام التبديل الفوري بين اللغة العربية بالاتجاه من اليمين لليسار (RTL) واللغة الإنجليزية (LTR) مع ترجمة كاملة لكافة الجداول والرسائل.'
            : 'Instantly toggle between Arabic (RTL) and English (LTR) with full bilingual coverage across all tables, fields, and messages.'}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage('ar')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              language === 'ar'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <span>العربية (RTL)</span>
            {language === 'ar' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>

          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/40'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <span>English (LTR)</span>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </div>

      {/* GitHub Pages Deployment Guide Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Github className="w-4 h-4 text-emerald-400" />
          <span>{language === 'ar' ? 'إرشادات النشر على GitHub Pages' : 'GitHub Pages Deployment Guide'}</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {language === 'ar'
            ? 'المشروع مصمم ليعمل كـ Client-Side Single Page Application مستقل بالكامل دون أي متطلبات Backend أو اتصال بقاعدة بيانات خارجية. لنشر المشروع على GitHub Pages:'
            : 'The project is engineered as an entirely self-contained client-side application. To publish to GitHub Pages:'}
        </p>

        <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 p-4 rounded-xl bg-slate-950 font-mono leading-relaxed border border-slate-800">
          <li>{language === 'ar' ? 'قم بتشغيل أمر البناء: ' : 'Run build command: '} <code className="text-emerald-400 font-bold">npm run build</code></li>
          <li>{language === 'ar' ? 'سينتج مجلد التوزيع: ' : 'Distribution folder output: '} <code className="text-indigo-400 font-bold">dist/</code></li>
          <li>{language === 'ar' ? 'ادفع مجلد dist إلى فرع ' : 'Deploy the dist folder to '} <code className="text-amber-400 font-bold">gh-pages</code> {language === 'ar' ? 'أو اربطه مع GitHub Actions' : 'or GitHub Actions.'}</li>
          <li>{language === 'ar' ? 'الموقع سيعمل مباشرة عبر المتصفح مع حفظ البيانات في LocalStorage!' : 'The app runs directly in the browser with full LocalStorage persistence!'}</li>
        </ol>
      </div>

      {/* Architecture Spec Card */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>{language === 'ar' ? 'مواصفات البنية الهندسية للنظام' : 'Database & Architectural Specs'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">{language === 'ar' ? 'الجداول المحاسبية' : 'Master Tables'}</span>
            <span className="text-lg font-bold font-mono text-white">{SCHEMAS.length} Tables</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">{language === 'ar' ? 'العلاقات المترابطة' : 'Relationships'}</span>
            <span className="text-lg font-bold font-mono text-indigo-400">{RELATIONSHIPS.length} Relations</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">{language === 'ar' ? 'محرك التخزين' : 'Storage Engine'}</span>
            <span className="text-lg font-bold font-mono text-emerald-400">LocalStorage</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">{language === 'ar' ? 'بيئة التشغيل' : 'Runtime'}</span>
            <span className="text-lg font-bold font-mono text-amber-400">100% Client-Side</span>
          </div>
        </div>
      </div>
    </div>
  );
};
