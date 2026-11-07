# Accounting Database & Chart of Accounts Designer
## مصمم قواعد البيانات المحاسبية وشجرة الحسابات

مشروع ويب احترافي متكامل بمستوى منتجات SaaS الحديثة لعرض وتصميم شجرة الحسابات المحاسبية (Chart of Accounts)، وبناء الجداول المحاسبية الـ 18 وعلاقاتها بصورة مرئية وتفاعلية على مخطط ERD، مع واجهة داكنة عالية الجودة ودعم كامل للغتين العربية والإنجليزية.

---

## 🌟 مميزات المشروع الرئيسية (Key Features)

1. **18 جدولاً محاسبياً متكاملاً (Full Accounting Schema)**:
   - **الشركات والدليل المحاسبي**: `Companies`, `AccountTypes`, `AccountNature`, `AccountLevels`, `AccountCategories`, `ChartOfAccounts`.
   - **العملات والفترات المالية**: `Currencies`, `FiscalYears`, `FiscalPeriods`, `ExchangeRates`.
   - **مراكز التكلفة الهرمية**: `CostCenters`, `AccountCostCenters` (علاقة N:M).
   - **القيود اليومية والترحيل**: `JournalEntries`, `JournalEntryLines` (توازن القيد المزدوج).
   - **الأرصدة المحاسبية**: `AccountBalances` (أرصدة افتتاحية، دورية، وختامية).
   - **المستخدمين والرقابة**: `Users`, `CompanyUsers` (علاقة N:M للمستأجرين وتعدد الشركات), `AuditLogs` (سجل تدقيق رقابي غير قابل للتعديل).

2. **شجرة حسابات تفاعلية هرمية (Recursive Chart of Accounts)**:
   - دعم عدد غير محدود من المستويات الهرمية.
   - منع الحلقات المغلقة (Cycle Detection) عبر محرك فحص العلاقات الهرمية.
   - منع الترحيل المباشر إلى الحسابات التجميعية الرئيسية.
   - المسار الهرمي التتبعي الكامل (Hierarchical Breadcrumb).
   - عمليات الإضافة، التعديل، والحذف مع التحقق الصارم من عدم وجود أبناء أو قيود مرتبطة.

3. **مخطط علاقات تفاعلي مرئي (Interactive ERD Diagram)**:
   - بطاقات مستقلة قابلة للسحب والإفلات (Drag & Drop) لكافة الجداول الـ 18.
   - مسارات الربط المنحنية (Smooth Bezier Connectors) بين المفاتيح الأجنبية والأساسية.
   - تمييز لوني دقيق: المفاتيح الأساسية PK (ذهبي)، المفاتيح الأجنبية FK (أزرق سماوي)، القيود الفريدة UQ (بنفسجي).
   - رموز الرتبة (Cardinality): 1:1, 1:N, N:M، والعلاقات الذاتية (Self-Referential).
   - تكبير، تصغير، وملاءمة الشاشة، وترتيب تلقائي ذكي (Auto Layout).
   - إمكانية تصدير المخطط كاملاً بصيغة SVG بنقرة واحدة.

4. **استعراض وتعديل الجداول (Structure & Data Views)**:
   - عرض تصميم الجدول Structure View مع كافة القيود والأنواع والمراجع.
   - عرض البيانات Data View مع جدول تفاعلي، بحث، ترقيم صفحات، وإضافة وتعديل وحذف السجلات تجريبياً.

5. **تخزين محلي 100% بدون خوادم خارجية (Zero-Backend LocalStorage Engine)**:
   - تخزين فوري لكافة السجلات، الشجرة، ومواقع الجداول في متصفح المستخدم عبر LocalStorage.
   - تصدير واستيراد كامل قاعدة البيانات بصيغة JSON.
   - توليد وتصدير كود SQL DDL المعياري لإنشاء الجداول.
   - إمكانية إعادة تعيين البيانات التجريبية الأولية بنقرة زر.

6. **تصميم عصري ودعم ثنائي اللغة (Bilingual & RTL/LTR)**:
   - دعم اللغة العربية بالاتجاه الكامل من اليمين لليسار (RTL).
   - دعم اللغة الإنجليزية (LTR) مع تبديل فوري دون إعادة تحميل الصفحة.
   - لوحة ألوان داكنة مستوحاة من أفضل أدوات قواعد البيانات العالمية (DrawSQL, dbdiagram.io, Figma).

---

## 📁 هيكل ملفات المشروع (Project Architecture)

```
accounting-database-designer/
├── index.html                     # نقطة الدخول الرئيسية، الخطوط، والـ Meta Tags
├── package.json                   # التبعيات والسكربتات
├── tsconfig.json                  # إعدادات TypeScript
├── vite.config.ts                 # إعدادات Vite
├── src/
│   ├── main.tsx                   # مدخل React
│   ├── App.tsx                    # الهيكل العام للواجهة والتنقل
│   ├── index.css                  # أنماط Tailwind والشبكة والخلفيات
│   ├── types/
│   │   └── index.ts               # تعريفات TypeScript لكافة الجداول والأنواع
│   ├── db/
│   │   ├── schema.ts              # تعريف الجداول الـ18 والحقول والقيود
│   │   ├── relationships.ts       # تعريف العلاقات والـ Foreign Keys والرتب
│   │   ├── seed.ts                # البيانات التجريبية الأولية المترابطة
│   │   ├── storage.ts             # طبقة التخزين المحلي LocalStorage و CRUD و DDL
│   │   ├── validation.ts          # محرك التحقق من القيود والدورات والتوازن
│   │   └── validation.test.ts     # اختبارات الوحدة الآلية (Unit Tests)
│   ├── locales/
│   │   └── translations.ts        # القاموس المترجم (عربي / إنجليزي)
│   ├── context/
│   │   └── AppContext.tsx         # إدارة الحالة العامة واللغة والإشعارات
│   └── components/
│       ├── layout/
│       │   ├── Sidebar.tsx        # الشريط الجانبي والتنقل
│       │   └── Navbar.tsx         # الشريط العلوي والبحث والإجراءات السريعة
│       ├── dashboard/
│       │   └── DashboardView.tsx  # لوحة التحكم والمؤشرات الإحصائية الـ10
│       ├── accounts/
│       │   └── ChartOfAccountsView.tsx # شجرة الحسابات التفاعلية الهرمية
│       ├── erd/
│       │   └── ErdDiagramView.tsx # مخطط العلاقات ERD مع السحب والتكبير
│       ├── tables/
│       │   ├── TablesListView.tsx # استعراض الجداول الـ18 مصنفة
│       │   └── TableDetailsView.tsx # تفاصيل الجدول (Structure & Data)
│       ├── relationships/
│       │   └── RelationshipsView.tsx # مصفوفة العلاقات الـ30
│       ├── data/
│       │   └── DataManagerView.tsx # تصدير/استيراد JSON و SQL وإحصائيات التخزين
│       ├── settings/
│       │   └── SettingsView.tsx   # الإعدادات وإرشادات النشر
│       └── modals/
│           └── ModalsContainer.tsx # النوافذ المنبثقة للإضافة والتعديل والإشعارات
```

---

## 🚀 طريقة التشغيل محلياً (How to Run Locally)

1. **تثبيت التبعيات**:
   ```bash
   npm install
   ```

2. **تشغيل سيرفر التطوير**:
   ```bash
   npm run dev
   ```
   افتح المتصفح على: `http://localhost:3000`

3. **تشغيل اختبارات الوحدة (Unit Tests)**:
   ```bash
   npx --yes tsx --test src/db/validation.test.ts
   ```

4. **بناء نسخة الإنتاج**:
   ```bash
   npm run build
   ```

---

## 🌐 خطوات النشر على GitHub Pages (Deployment to GitHub Pages)

بما أن المشروع يعتمد بنسبة 100% على تقنيات المتصفح (Client-Side Vanilla React + LocalStorage) دون أي خوادم أو APIs خلفية، فإنه جاهز للنشر الفوري على GitHub Pages عبر الخطوات التالية:

### الطريقة الأولى: النشر التلقائي عبر GitHub Actions (موصى بها)

1. أنشئ ملفاً باسم `.github/workflows/deploy.yml` في مستودع GitHub الخاص بك.
2. أضف المحتوى التالي:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   permissions:
     contents: read
     pages: write
     id-token: write

   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build project
           run: npm run build

         - name: Setup Pages
           uses: actions/configure-pages@v4

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: './dist'

         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```
3. توجه إلى إعدادات المستودع **Settings -> Pages**، واختر **Source: GitHub Actions**.
4. عند كل Push لفرع `main`، سيتم بناء ونشر الموقع تلقائياً.

### الطريقة الثانية: النشر اليدوي عبر حزمة gh-pages

1. قم بتشغيل أمر البناء:
   ```bash
   npm run build
   ```
2. ادفع محتويات مجلد `dist` إلى فرع `gh-pages` في مستودعك.
3. فعّل النشر من فرع `gh-pages` في إعدادات المستودع.
