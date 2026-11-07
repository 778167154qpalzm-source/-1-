import { TableGroup, TableSchema } from '../types';

export const TABLE_GROUPS: TableGroup[] = [
  {
    id: 'company_accounts',
    nameAr: 'الشركات وشجرة الحسابات',
    nameEn: 'Companies & Chart of Accounts',
    color: '#3B82F6', // Blue
    headerColor: 'from-blue-600 to-indigo-700',
    descriptionAr: 'الجداول المحورية لإدارة بنية الدليل المحاسبي والشركات والمستويات',
    descriptionEn: 'Core tables managing chart of accounts hierarchy, companies, and taxonomy'
  },
  {
    id: 'fiscal_currencies',
    nameAr: 'العملات والفترات المالية',
    nameEn: 'Currencies & Fiscal Periods',
    color: '#10B981', // Emerald
    headerColor: 'from-emerald-600 to-teal-700',
    descriptionAr: 'إدارة العملات متعددة الأطراف والسنوات المالية والفترات المحاسبية',
    descriptionEn: 'Multi-currency management, exchange rates, fiscal years, and accounting periods'
  },
  {
    id: 'cost_centers',
    nameAr: 'مراكز التكلفة',
    nameEn: 'Cost Centers',
    color: '#F59E0B', // Amber
    headerColor: 'from-amber-600 to-orange-700',
    descriptionAr: 'الهيكل الهرمي لمراكز التكلفة وربطها متعدد إلى متعدد بالحسابات',
    descriptionEn: 'Hierarchical cost centers structure and M:N mapping with accounts'
  },
  {
    id: 'journal_entries',
    nameAr: 'القيود اليومية والعمليات',
    nameEn: 'Journal Entries & Transactions',
    color: '#8B5CF6', // Purple
    headerColor: 'from-purple-600 to-violet-800',
    descriptionAr: 'رؤوس وتفاصيل القيود اليومية المحاسبية المزدوجة وضوابط التوازن',
    descriptionEn: 'Double-entry general journal vouchers, transaction lines, and balance validation'
  },
  {
    id: 'balances',
    nameAr: 'الأرصدة المحاسبية',
    nameEn: 'Account Balances',
    color: '#EC4899', // Pink
    headerColor: 'from-pink-600 to-rose-700',
    descriptionAr: 'سجلات تجميع الأرصدة الافتتاحية والدورية والختامية للحسابات',
    descriptionEn: 'Aggregated opening, period movements, and closing trial balance snapshots'
  },
  {
    id: 'users_audit',
    nameAr: 'المستخدمون والتدقيق',
    nameEn: 'Users & Audit Logs',
    color: '#06B6D4', // Cyan
    headerColor: 'from-cyan-600 to-sky-700',
    descriptionAr: 'المستخدمين والصلاحيات وسجل التدقيق والرقابة على العمليات',
    descriptionEn: 'User accounts, company tenancy access, roles, and immutable audit trails'
  }
];

export const SCHEMAS: TableSchema[] = [
  // 1. Companies
  {
    name: 'Companies',
    nameAr: 'الشركات',
    nameEn: 'Companies',
    groupId: 'company_accounts',
    primaryKey: 'CompanyId',
    descriptionAr: 'بيانات الشركات والكيانات القانونية التي تستخدم النظام المحاسبي',
    descriptionEn: 'Corporate entities and legal tenants utilizing the accounting system',
    defaultPosition: { x: 50, y: 50 },
    columns: [
      { name: 'CompanyId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للشركة', descriptionEn: 'Primary Key identifier' },
      { name: 'CompanyCode', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'رمز الشركة الفريد', descriptionEn: 'Unique company code', constraints: ['UNIQUE', 'NOT NULL'] },
      { name: 'CompanyName', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'الاسم التجاري للشركة', descriptionEn: 'Company legal / commercial name', constraints: ['NOT NULL'] },
      { name: 'CommercialRegistration', type: 'VARCHAR(100)', isNullable: true, descriptionAr: 'رقم السجل التجاري (CR)', descriptionEn: 'Commercial registration number' },
      { name: 'TaxNumber', type: 'VARCHAR(100)', isNullable: true, descriptionAr: 'الرقم الضريبي (VAT / Tax ID)', descriptionEn: 'Tax identification / VAT number' },
      { name: 'Address', type: 'TEXT', isNullable: true, descriptionAr: 'العنوان الجغرافي والفرع الرئيسي', descriptionEn: 'Physical address & headquarters' },
      { name: 'Phone', type: 'VARCHAR(50)', isNullable: true, descriptionAr: 'رقم هاتف الاتصال المعتمد', descriptionEn: 'Official contact phone' },
      { name: 'Email', type: 'VARCHAR(100)', isNullable: true, descriptionAr: 'البريد الإلكتروني الرسمي', descriptionEn: 'Official company email' },
      { 
        name: 'BaseCurrencyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Currencies', column: 'CurrencyId', onDelete: 'RESTRICT' },
        descriptionAr: 'العملة الأساسية للتقارير والقوائم المالية', 
        descriptionEn: 'Functional reporting currency for this company' 
      },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة نشاط الشركة بالنظام', descriptionEn: 'Company active status' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ ووقت تسجيل الشركة', descriptionEn: 'Timestamp of creation' }
    ]
  },

  // 2. AccountTypes
  {
    name: 'AccountTypes',
    nameAr: 'أنواع الحسابات',
    nameEn: 'Account Types',
    groupId: 'company_accounts',
    primaryKey: 'AccountTypeId',
    descriptionAr: 'التصنيف المحاسبي القياسي للأبواب الخمسة الرئيسية (الأصول، الخصوم، حقوق الملكية، الإيرادات، المصروفات)',
    descriptionEn: 'Standard master accounting classification (Assets, Liabilities, Equity, Revenue, Expenses)',
    defaultPosition: { x: 420, y: 50 },
    columns: [
      { name: 'AccountTypeId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لنوع الحساب', descriptionEn: 'Primary Key' },
      { name: 'TypeCode', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'الرمز الرقمي القياسي لنوع الحساب', descriptionEn: 'Standard code (e.g., 1, 2, 3, 4, 5)' },
      { name: 'TypeNameAr', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم نوع الحساب بالعربية', descriptionEn: 'Arabic name of account type' },
      { name: 'TypeNameEn', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم نوع الحساب بالإنجليزية', descriptionEn: 'English name of account type' },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'شرح معايير وتأثير نوع الحساب في الميزانية أو قائمة الدخل', descriptionEn: 'Description and financial statement placement' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة نشاط النوع', descriptionEn: 'Active flag' }
    ]
  },

  // 3. AccountNature
  {
    name: 'AccountNature',
    nameAr: 'طبيعة الحسابات',
    nameEn: 'Account Nature',
    groupId: 'company_accounts',
    primaryKey: 'AccountNatureId',
    descriptionAr: 'الطبيعة المحاسبية للرصيد القياسي (مدين Debit أو دائن Credit)',
    descriptionEn: 'Accounting balance nature (Debit or Credit standard balance)',
    defaultPosition: { x: 770, y: 50 },
    columns: [
      { name: 'AccountNatureId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لطبيعة الحساب', descriptionEn: 'Primary Key' },
      { name: 'NatureCode', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'رمز الطبيعة المحاسبية (DR / CR)', descriptionEn: 'Nature code (DR / CR)' },
      { name: 'NatureNameAr', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'الاسم بالعربية (مدين / دائن)', descriptionEn: 'Arabic name' },
      { name: 'NatureNameEn', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'الاسم بالإنجليزية (Debit / Credit)', descriptionEn: 'English name' },
      { name: 'NormalBalance', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'الرصيد الطبيعي المعتاد', descriptionEn: 'Normal balance rule' },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'قواعد الزيادة والنقصان في الحساب', descriptionEn: 'Debit/Credit increase-decrease behavior rules' }
    ]
  },

  // 4. AccountLevels
  {
    name: 'AccountLevels',
    nameAr: 'مستويات الحسابات',
    nameEn: 'Account Levels',
    groupId: 'company_accounts',
    primaryKey: 'AccountLevelId',
    descriptionAr: 'مستويات العمق الهرمي في دليل الحسابات وأطوال الترقيم المحددة',
    descriptionEn: 'Hierarchical depth levels and structured code lengths in chart of accounts',
    defaultPosition: { x: 1120, y: 50 },
    columns: [
      { name: 'AccountLevelId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للمستوى', descriptionEn: 'Primary Key' },
      { name: 'LevelNumber', type: 'INT', isUnique: true, isNullable: false, descriptionAr: 'رقم المستوى الترتيبي (1, 2, 3...)', descriptionEn: 'Ordinal level depth number' },
      { name: 'LevelNameAr', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم المستوى بالعربية (رئيسي، فرعي، تفصيلي...)', descriptionEn: 'Level Arabic title' },
      { name: 'LevelNameEn', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم المستوى بالإنجليزية', descriptionEn: 'Level English title' },
      { name: 'CodeLength', type: 'INT', isNullable: false, descriptionAr: 'عدد خانات كود الحساب المقترحة لهذا المستوى', descriptionEn: 'Digits length recommended for this level' },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'وصف قواعد المستوى والترحيل', descriptionEn: 'Description of level depth purpose' }
    ]
  },

  // 5. AccountCategories
  {
    name: 'AccountCategories',
    nameAr: 'تصنيفات الحسابات',
    nameEn: 'Account Categories',
    groupId: 'company_accounts',
    primaryKey: 'AccountCategoryId',
    descriptionAr: 'المجموعات الفرعية المحاسبية (أصول متداولة، نقدية، عملاء، أصول ثابتة، موردون، التزامات قصيرة الأجل...) ',
    descriptionEn: 'Financial statement sub-categories (Current Assets, Cash, Fixed Assets, Accounts Payable...)',
    defaultPosition: { x: 50, y: 460 },
    columns: [
      { name: 'AccountCategoryId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للتصنيف', descriptionEn: 'Primary Key' },
      { name: 'CategoryCode', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'رمز التصنيف الفرعي', descriptionEn: 'Category code' },
      { name: 'CategoryNameAr', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم التصنيف بالعربية', descriptionEn: 'Category Arabic title' },
      { name: 'CategoryNameEn', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم التصنيف بالإنجليزية', descriptionEn: 'Category English title' },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'وصف نطاق الحسابات المندرجة تحته', descriptionEn: 'Detailed scope of included accounts' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة نشاط التصنيف', descriptionEn: 'Active flag' }
    ]
  },

  // 6. ChartOfAccounts
  {
    name: 'ChartOfAccounts',
    nameAr: 'شجرة الحسابات',
    nameEn: 'Chart of Accounts',
    groupId: 'company_accounts',
    primaryKey: 'AccountId',
    descriptionAr: 'الجدول المحوري الذي يبني الهيكل الشجري الهرمي لكافة الحسابات المحاسبية',
    descriptionEn: 'Core central table defining the hierarchical recursive tree of general ledger accounts',
    defaultPosition: { x: 420, y: 460 },
    columns: [
      { name: 'AccountId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المعرف الأساسي للحساب', descriptionEn: 'Account Primary Key' },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'CASCADE' },
        descriptionAr: 'الشركة المالكة للحساب', 
        descriptionEn: 'Company tenant identifier' 
      },
      { name: 'AccountCode', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'رقم الحساب المحاسبي المنظم', descriptionEn: 'Structured account code (e.g. 110101)', constraints: ['NOT NULL'] },
      { name: 'AccountNameAr', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'اسم الحساب بالعربية', descriptionEn: 'Arabic account name', constraints: ['NOT NULL'] },
      { name: 'AccountNameEn', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'اسم الحساب بالإنجليزية', descriptionEn: 'English account name', constraints: ['NOT NULL'] },
      { 
        name: 'ParentAccountId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'ChartOfAccounts', column: 'AccountId', onDelete: 'RESTRICT' },
        descriptionAr: 'الحساب الأب (علاقة ذاتية متكررة داخل الجدول)', 
        descriptionEn: 'Parent account reference (Self-referencing tree relation)' 
      },
      { 
        name: 'AccountTypeId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'AccountTypes', column: 'AccountTypeId', onDelete: 'RESTRICT' },
        descriptionAr: 'نوع الحساب (أصل، التزام، ملكية، إيراد، مصروف)', 
        descriptionEn: 'Account classification type' 
      },
      { 
        name: 'AccountNatureId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'AccountNature', column: 'AccountNatureId', onDelete: 'RESTRICT' },
        descriptionAr: 'طبيعة الحساب (مدين / دائن)', 
        descriptionEn: 'Account normal balance nature' 
      },
      { 
        name: 'AccountLevelId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'AccountLevels', column: 'AccountLevelId', onDelete: 'RESTRICT' },
        descriptionAr: 'المستوى الهرمي للحساب بالشجرة', 
        descriptionEn: 'Account hierarchical depth level' 
      },
      { 
        name: 'AccountCategoryId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'AccountCategories', column: 'AccountCategoryId', onDelete: 'SET NULL' },
        descriptionAr: 'تصنيف القوائم المالية للحساب', 
        descriptionEn: 'Financial statement category' 
      },
      { name: 'IsParent', type: 'BOOLEAN', isNullable: false, defaultValue: false, descriptionAr: 'هل الحساب تجميعي رئيسي يحوي أبناء؟', descriptionEn: 'True if parent/grouping account containing children' },
      { name: 'IsPostingAllowed', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'هل يسمح بإجراء قيود مباشرة عليه؟', descriptionEn: 'Allows transactional posting (false for header groups)' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة الحساب (نشط / موقف)', descriptionEn: 'Account active status' },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'ملاحظات وتوجيهات استخدام الحساب', descriptionEn: 'Account usage guidelines' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ الإنشاء', descriptionEn: 'Creation timestamp' },
      { name: 'UpdatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ آخر تحديث', descriptionEn: 'Last update timestamp' }
    ]
  },

  // 7. Currencies
  {
    name: 'Currencies',
    nameAr: 'العملات',
    nameEn: 'Currencies',
    groupId: 'fiscal_currencies',
    primaryKey: 'CurrencyId',
    descriptionAr: 'دليل العملات المستخدمة بالنظام المحاسبي ورموزها وكسورها',
    descriptionEn: 'Currencies catalog, ISO codes, symbols, and decimal precision',
    defaultPosition: { x: 50, y: 920 },
    columns: [
      { name: 'CurrencyId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للعملة', descriptionEn: 'Primary Key' },
      { name: 'CurrencyCode', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'رمز الأيزو للعملة (مثل SAR, USD, EUR)', descriptionEn: 'ISO 4217 Currency Code', constraints: ['UNIQUE', 'NOT NULL'] },
      { name: 'CurrencyNameAr', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم العملة بالعربية', descriptionEn: 'Currency name in Arabic' },
      { name: 'CurrencyNameEn', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم العملة بالإنجليزية', descriptionEn: 'Currency name in English' },
      { name: 'CurrencySymbol', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'رمز العملة المختصر (مثل ر.س أو $)', descriptionEn: 'Currency graphical symbol' },
      { name: 'DecimalPlaces', type: 'INT', isNullable: false, defaultValue: 2, descriptionAr: 'عدد الخانات العشرية للعملة', descriptionEn: 'Decimal places precision' },
      { name: 'IsBaseCurrency', type: 'BOOLEAN', isNullable: false, defaultValue: false, descriptionAr: 'هل هي عملة التقييم الأساسية؟', descriptionEn: 'Is system base currency flag' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة تفعيل العملة بالعمليات', descriptionEn: 'Active flag' }
    ]
  },

  // 8. FiscalYears
  {
    name: 'FiscalYears',
    nameAr: 'السنوات المالية',
    nameEn: 'Fiscal Years',
    groupId: 'fiscal_currencies',
    primaryKey: 'FiscalYearId',
    descriptionAr: 'السنوات المالية المحاسبية لكل شركة وتواريخ بدئها ونهايتها وحالتها',
    descriptionEn: 'Annual accounting fiscal cycles per company with start/end dates and closure state',
    defaultPosition: { x: 420, y: 920 },
    columns: [
      { name: 'FiscalYearId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للسنة المالية', descriptionEn: 'Primary Key' },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'CASCADE' },
        descriptionAr: 'الشركة التابعة لها السنة', 
        descriptionEn: 'Company tenant identifier' 
      },
      { name: 'YearCode', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'رمز السنة المالية (مثل FY2026)', descriptionEn: 'Fiscal Year unique code' },
      { name: 'YearName', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم السنة المالية بالعربية/الإنجليزية', descriptionEn: 'Fiscal Year title' },
      { name: 'StartDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ بداية السنة المالية', descriptionEn: 'Cycle starting date' },
      { name: 'EndDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ نهاية السنة المالية', descriptionEn: 'Cycle ending date' },
      { name: 'Status', type: 'VARCHAR(50)', isNullable: false, defaultValue: 'Open', descriptionAr: 'حالة السنة (مفتوحة، مقفلة، تحت الإقفال)', descriptionEn: 'Status (Open, Closing, Closed)' },
      { name: 'IsClosed', type: 'BOOLEAN', isNullable: false, defaultValue: false, descriptionAr: 'هل تم إقفال حسابات السنة نهائياً؟', descriptionEn: 'Closed and locked flag' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ الإنشاء', descriptionEn: 'Record creation timestamp' }
    ]
  },

  // 9. FiscalPeriods
  {
    name: 'FiscalPeriods',
    nameAr: 'الفترات المالية',
    nameEn: 'Fiscal Periods',
    groupId: 'fiscal_currencies',
    primaryKey: 'FiscalPeriodId',
    descriptionAr: 'الفترات المحاسبية الشهرية أو الربع سنوية التابعة للسنة المالية',
    descriptionEn: 'Monthly or quarterly accounting periods subdivision of fiscal years',
    defaultPosition: { x: 770, y: 920 },
    columns: [
      { name: 'FiscalPeriodId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للفترة', descriptionEn: 'Primary Key' },
      { 
        name: 'FiscalYearId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'FiscalYears', column: 'FiscalYearId', onDelete: 'CASCADE' },
        descriptionAr: 'السنة المالية الحاضنة للفترة', 
        descriptionEn: 'Owning fiscal year' 
      },
      { name: 'PeriodNumber', type: 'INT', isNullable: false, descriptionAr: 'رقم الفترة الترتيبي بالسنة (1 إلى 12)', descriptionEn: 'Period number in cycle (1 to 12)' },
      { name: 'PeriodName', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم الفترة (يناير 2026، الربع الأول...)', descriptionEn: 'Period name' },
      { name: 'StartDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ بداية الفترة', descriptionEn: 'Period start date' },
      { name: 'EndDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ نهاية الفترة', descriptionEn: 'Period end date' },
      { name: 'Status', type: 'VARCHAR(50)', isNullable: false, defaultValue: 'Open', descriptionAr: 'حالة الفترة (مفتوحة، مغلقة)', descriptionEn: 'Period status (Open, Closed)' },
      { name: 'IsClosed', type: 'BOOLEAN', isNullable: false, defaultValue: false, descriptionAr: 'هل أغلقت لمنع التعديل والترحيل؟', descriptionEn: 'Period locked flag' }
    ]
  },

  // 10. ExchangeRates
  {
    name: 'ExchangeRates',
    nameAr: 'أسعار الصرف',
    nameEn: 'Exchange Rates',
    groupId: 'fiscal_currencies',
    primaryKey: 'ExchangeRateId',
    descriptionAr: 'جدول أسعار صرف العملات الأجنبية مقابل العملة الأساسية وتواريخ سريانها',
    descriptionEn: 'Foreign currency exchange conversion rates matrix with effective dates',
    defaultPosition: { x: 1120, y: 920 },
    columns: [
      { name: 'ExchangeRateId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لسعر الصرف', descriptionEn: 'Primary Key' },
      { 
        name: 'FromCurrencyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Currencies', column: 'CurrencyId', onDelete: 'RESTRICT' },
        descriptionAr: 'العملة المصدر المحوّل منها', 
        descriptionEn: 'Source transaction currency' 
      },
      { 
        name: 'ToCurrencyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Currencies', column: 'CurrencyId', onDelete: 'RESTRICT' },
        descriptionAr: 'العملة الهدف المحوّل إليها', 
        descriptionEn: 'Target base reporting currency' 
      },
      { name: 'Rate', type: 'DECIMAL(18,4)', isNullable: false, descriptionAr: 'معامل التحويل وسعر الصرف', descriptionEn: 'Exchange rate multiplier' },
      { name: 'EffectiveDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ بدء سريان سعر الصرف', descriptionEn: 'Effective valuation date' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ ووقت تسجيل السعر', descriptionEn: 'Rate entry timestamp' }
    ]
  },

  // 11. CostCenters
  {
    name: 'CostCenters',
    nameAr: 'مراكز التكلفة',
    nameEn: 'Cost Centers',
    groupId: 'cost_centers',
    primaryKey: 'CostCenterId',
    descriptionAr: 'الهيكل الهرمي لمراكز التكلفة والأقسام والفروع لتوزيع الإيرادات والمصروفات',
    descriptionEn: 'Hierarchical cost and profit centers structure for analytical accounting',
    defaultPosition: { x: 50, y: 1350 },
    columns: [
      { name: 'CostCenterId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لمركز التكلفة', descriptionEn: 'Primary Key' },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'CASCADE' },
        descriptionAr: 'الشركة المالكة للمركز', 
        descriptionEn: 'Company tenant identifier' 
      },
      { name: 'CostCenterCode', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'رمز مركز التكلفة الفريد', descriptionEn: 'Structured cost center code' },
      { name: 'CostCenterNameAr', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'اسم مركز التكلفة بالعربية', descriptionEn: 'Arabic name' },
      { name: 'CostCenterNameEn', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'اسم مركز التكلفة بالإنجليزية', descriptionEn: 'English name' },
      { 
        name: 'ParentCostCenterId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'CostCenters', column: 'CostCenterId', onDelete: 'RESTRICT' },
        descriptionAr: 'مركز التكلفة الأب (هيكل شجري)', 
        descriptionEn: 'Parent cost center reference (self-referencing)' 
      },
      { name: 'Description', type: 'TEXT', isNullable: true, descriptionAr: 'وصف اختصاص مركز التكلفة', descriptionEn: 'Description of department / unit' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة نشاط المركز', descriptionEn: 'Active status' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ الإنشاء', descriptionEn: 'Creation timestamp' }
    ]
  },

  // 12. AccountCostCenters
  {
    name: 'AccountCostCenters',
    nameAr: 'ربط الحسابات بمراكز التكلفة',
    nameEn: 'Account Cost Centers Link',
    groupId: 'cost_centers',
    primaryKey: 'AccountCostCenterId',
    descriptionAr: 'جدول وسيط ينشئ علاقة متعدد إلى متعدد (M:N) لربط الحسابات المحاسبية بمراكز التكلفة',
    descriptionEn: 'Junction table creating M:N relationship linking accounts with allowed cost centers',
    defaultPosition: { x: 420, y: 1350 },
    columns: [
      { name: 'AccountCostCenterId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للرابط', descriptionEn: 'Primary Key' },
      { 
        name: 'AccountId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'ChartOfAccounts', column: 'AccountId', onDelete: 'CASCADE' },
        descriptionAr: 'الحساب المحاسبي المرتبط', 
        descriptionEn: 'Referenced Chart of Account' 
      },
      { 
        name: 'CostCenterId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'CostCenters', column: 'CostCenterId', onDelete: 'CASCADE' },
        descriptionAr: 'مركز التكلفة المرتبط', 
        descriptionEn: 'Referenced Cost Center' 
      },
      { name: 'IsRequired', type: 'BOOLEAN', isNullable: false, defaultValue: false, descriptionAr: 'هل إدخال مركز التكلفة إلزامي عند القيد؟', descriptionEn: 'Is cost center mandatory upon posting' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ ربط الحساب بالمركز', descriptionEn: 'Creation timestamp' }
    ]
  },

  // 13. JournalEntries
  {
    name: 'JournalEntries',
    nameAr: 'القيود اليومية',
    nameEn: 'Journal Entries',
    groupId: 'journal_entries',
    primaryKey: 'JournalEntryId',
    descriptionAr: 'سجل رأس القيود اليومية العامة المحاسبية مع مجاميع المدين والدائن وحالة الاعتماد',
    descriptionEn: 'General journal voucher headers with balanced debit/credit sums and approval status',
    defaultPosition: { x: 770, y: 1350 },
    columns: [
      { name: 'JournalEntryId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لرأس القيد', descriptionEn: 'Primary Key' },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'RESTRICT' },
        descriptionAr: 'الشركة المصدرة للقيد', 
        descriptionEn: 'Company tenant identifier' 
      },
      { 
        name: 'FiscalPeriodId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'FiscalPeriods', column: 'FiscalPeriodId', onDelete: 'RESTRICT' },
        descriptionAr: 'الفترة المالية التابع لها القيد', 
        descriptionEn: 'Associated accounting fiscal period' 
      },
      { name: 'EntryNumber', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'رقم السند/القيد التسلسلي المالي', descriptionEn: 'Voucher serial document number' },
      { name: 'EntryDate', type: 'DATE', isNullable: false, descriptionAr: 'تاريخ إثبات المعاملة المحاسبية', descriptionEn: 'Accounting effective transaction date' },
      { name: 'ReferenceNumber', type: 'VARCHAR(100)', isNullable: true, descriptionAr: 'الرقم المرجعي أو رقم الفاتورة/الشيك المرفق', descriptionEn: 'Source document / external invoice reference' },
      { name: 'Description', type: 'TEXT', isNullable: false, descriptionAr: 'البيان العام وشرح موضوع القيد', descriptionEn: 'General description / memo' },
      { name: 'EntryType', type: 'VARCHAR(50)', isNullable: false, defaultValue: 'General', descriptionAr: 'نوع القيد (عام، افتتاحي، تسوية، إقفال)', descriptionEn: 'Voucher type (General, Opening, Adjusting, Closing)' },
      { name: 'Status', type: 'VARCHAR(50)', isNullable: false, defaultValue: 'Draft', descriptionAr: 'حالة القيد (Draft, Pending, Approved, Posted, Cancelled)', descriptionEn: 'Voucher workflow status' },
      { name: 'TotalDebit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'إجمالي الجانب المدين للقيد', descriptionEn: 'Sum of all debit lines' },
      { name: 'TotalCredit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'إجمالي الجانب الدائن للقيد', descriptionEn: 'Sum of all credit lines' },
      { 
        name: 'CreatedByUserId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Users', column: 'UserId', onDelete: 'RESTRICT' },
        descriptionAr: 'المستخدم المحاسب منشئ القيد', 
        descriptionEn: 'Creator user identifier' 
      },
      { 
        name: 'ApprovedByUserId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'Users', column: 'UserId', onDelete: 'SET NULL' },
        descriptionAr: 'المشرف/المدير المعتمد للقيد', 
        descriptionEn: 'Approver user identifier' 
      },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'وقت إنشاء القيد بالنظام', descriptionEn: 'Entry creation timestamp' },
      { name: 'PostedAt', type: 'DATETIME', isNullable: true, descriptionAr: 'وقت الترحيل الفعلي لدفتر الأستاذ', descriptionEn: 'Ledger posting timestamp' }
    ]
  },

  // 14. JournalEntryLines
  {
    name: 'JournalEntryLines',
    nameAr: 'تفاصيل القيود اليومية',
    nameEn: 'Journal Entry Lines',
    groupId: 'journal_entries',
    primaryKey: 'JournalEntryLineId',
    descriptionAr: 'أسطر القيد التفصيلية التي تحدد الحسابات والمبالغ المدينة والدائنة والعملات ومراكز التكلفة',
    descriptionEn: 'Detailed debit and credit line items per voucher specifying accounts, currencies, and cost centers',
    defaultPosition: { x: 1120, y: 1350 },
    columns: [
      { name: 'JournalEntryLineId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لسطر القيد', descriptionEn: 'Primary Key' },
      { 
        name: 'JournalEntryId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'JournalEntries', column: 'JournalEntryId', onDelete: 'CASCADE' },
        descriptionAr: 'رقم القيد الأب التابع له السطر', 
        descriptionEn: 'Parent journal voucher identifier' 
      },
      { 
        name: 'AccountId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'ChartOfAccounts', column: 'AccountId', onDelete: 'RESTRICT' },
        descriptionAr: 'الحساب المحاسبي المحدد بالسطر (يشترط أن يسمح بالترحيل)', 
        descriptionEn: 'Posted general ledger account' 
      },
      { 
        name: 'CostCenterId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'CostCenters', column: 'CostCenterId', onDelete: 'SET NULL' },
        descriptionAr: 'مركز التكلفة المخصص لهذا السطر', 
        descriptionEn: 'Assigned analytical cost center' 
      },
      { 
        name: 'CurrencyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Currencies', column: 'CurrencyId', onDelete: 'RESTRICT' },
        descriptionAr: 'عملة المعاملة الخاصة بهذا السطر', 
        descriptionEn: 'Line transaction currency' 
      },
      { name: 'ExchangeRate', type: 'DECIMAL(18,4)', isNullable: false, defaultValue: 1.0, descriptionAr: 'سعر الصرف المعتمد لتحويل عملة السطر للعملة الأساسية', descriptionEn: 'Conversion rate to base reporting currency' },
      { name: 'Description', type: 'VARCHAR(255)', isNullable: true, descriptionAr: 'شرح وبيان خاص بهذا السطر', descriptionEn: 'Line specific description / note' },
      { name: 'DebitAmount', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'المبلغ المدين بالعملة الأجنبية/المعاملة', descriptionEn: 'Debit amount in transaction currency' },
      { name: 'CreditAmount', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'المبلغ الدائن بالعملة الأجنبية/المعاملة', descriptionEn: 'Credit amount in transaction currency' },
      { name: 'BaseDebitAmount', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'المبلغ المدين المعادل بالعملة الأساسية', descriptionEn: 'Debit equivalent in functional base currency' },
      { name: 'BaseCreditAmount', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'المبلغ الدائن المعادل بالعملة الأساسية', descriptionEn: 'Credit equivalent in functional base currency' },
      { name: 'LineNumber', type: 'INT', isNullable: false, descriptionAr: 'رقم السطر التسلسلي بالقيد', descriptionEn: 'Line sequential position' }
    ]
  },

  // 15. AccountBalances
  {
    name: 'AccountBalances',
    nameAr: 'أرصدة الحسابات',
    nameEn: 'Account Balances',
    groupId: 'balances',
    primaryKey: 'AccountBalanceId',
    descriptionAr: 'سجلات أرصدة الحسابات المحاسبية المفصلة حسب الفترة والعملة مع الحركات والختام',
    descriptionEn: 'Aggregated opening balances, periodic debits/credits, and closing balances snapshot',
    defaultPosition: { x: 50, y: 1800 },
    columns: [
      { name: 'AccountBalanceId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لسجل الرصيد', descriptionEn: 'Primary Key' },
      { 
        name: 'AccountId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'ChartOfAccounts', column: 'AccountId', onDelete: 'RESTRICT' },
        descriptionAr: 'الحساب المحاسبي المرصد', 
        descriptionEn: 'Tracked general ledger account' 
      },
      { 
        name: 'FiscalPeriodId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'FiscalPeriods', column: 'FiscalPeriodId', onDelete: 'RESTRICT' },
        descriptionAr: 'الفترة المالية الخاصة بالرصيد', 
        descriptionEn: 'Associated fiscal period' 
      },
      { 
        name: 'CurrencyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Currencies', column: 'CurrencyId', onDelete: 'RESTRICT' },
        descriptionAr: 'عملة الرصيد المحسوب', 
        descriptionEn: 'Balance currency' 
      },
      { name: 'OpeningDebit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'رصيد أول المدة المدين', descriptionEn: 'Period opening debit balance' },
      { name: 'OpeningCredit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'رصيد أول المدة الدائن', descriptionEn: 'Period opening credit balance' },
      { name: 'PeriodDebit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'إجمالي الحركات المدينة خلال الفترة', descriptionEn: 'Total periodic debit movements' },
      { name: 'PeriodCredit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'إجمالي الحركات الدائنة خلال الفترة', descriptionEn: 'Total periodic credit movements' },
      { name: 'ClosingDebit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'الرصيد الختامي المدين بنهاية الفترة', descriptionEn: 'Calculated closing debit balance' },
      { name: 'ClosingCredit', type: 'DECIMAL(18,2)', isNullable: false, defaultValue: 0, descriptionAr: 'الرصيد الختامي الدائن بنهاية الفترة', descriptionEn: 'Calculated closing credit balance' },
      { name: 'LastUpdatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ آخر احتساب وتحديث', descriptionEn: 'Timestamp of last trial balance recalculation' }
    ]
  },

  // 16. Users
  {
    name: 'Users',
    nameAr: 'المستخدمون',
    nameEn: 'Users',
    groupId: 'users_audit',
    primaryKey: 'UserId',
    descriptionAr: 'بيانات مستخدمي النظام المحاسبي والمشرفين والمحاسبين والمدققين',
    descriptionEn: 'System users credentials, profiles, contact info, and security states',
    defaultPosition: { x: 420, y: 1800 },
    columns: [
      { name: 'UserId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للمستخدم', descriptionEn: 'User identifier' },
      { name: 'Username', type: 'VARCHAR(50)', isUnique: true, isNullable: false, descriptionAr: 'اسم الدخول الفريد', descriptionEn: 'Login username', constraints: ['UNIQUE', 'NOT NULL'] },
      { name: 'FullName', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'الاسم الكامل للمستخدم', descriptionEn: 'User display name' },
      { name: 'Email', type: 'VARCHAR(100)', isUnique: true, isNullable: false, descriptionAr: 'البريد الإلكتروني للتحقق والإشعارات', descriptionEn: 'User contact email' },
      { name: 'Phone', type: 'VARCHAR(50)', isNullable: true, descriptionAr: 'رقم هاتف المستخدم', descriptionEn: 'Phone number' },
      { name: 'PasswordHash', type: 'VARCHAR(255)', isNullable: false, descriptionAr: 'تجزئة كلمة المرور المشفرة', descriptionEn: 'Hashed password placeholder' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة حساب المستخدم', descriptionEn: 'Account active flag' },
      { name: 'CreatedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ تسجيل المستخدم', descriptionEn: 'Creation timestamp' },
      { name: 'LastLoginAt', type: 'DATETIME', isNullable: true, descriptionAr: 'تاريخ آخر تسجيل دخول ناجح', descriptionEn: 'Last authenticated session timestamp' }
    ]
  },

  // 17. CompanyUsers
  {
    name: 'CompanyUsers',
    nameAr: 'مستخدمو الشركات',
    nameEn: 'Company Users Tenancy',
    groupId: 'users_audit',
    primaryKey: 'CompanyUserId',
    descriptionAr: 'جدول وسيط ينشئ علاقة متعدد إلى متعدد بين الشركات والمستخدمين لتحديد الأدوار والصلاحيات',
    descriptionEn: 'Multi-tenant junction mapping users to assigned companies with role designations',
    defaultPosition: { x: 770, y: 1800 },
    columns: [
      { name: 'CompanyUserId', type: 'INT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي للربط', descriptionEn: 'Primary Key' },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'CASCADE' },
        descriptionAr: 'الشركة الممنوح صلاحيتها', 
        descriptionEn: 'Assigned Company' 
      },
      { 
        name: 'UserId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Users', column: 'UserId', onDelete: 'CASCADE' },
        descriptionAr: 'المستخدم المعين للشركة', 
        descriptionEn: 'Assigned User' 
      },
      { name: 'RoleName', type: 'VARCHAR(50)', isNullable: false, defaultValue: 'Accountant', descriptionAr: 'الدور الوظيفي بالشركة (مدير مالي، محاسب، مدقق)', descriptionEn: 'Role name (Admin, ChiefAccountant, Accountant, Auditor)' },
      { name: 'IsActive', type: 'BOOLEAN', isNullable: false, defaultValue: true, descriptionAr: 'حالة صلاحية الدخول للشركة', descriptionEn: 'Role active flag' },
      { name: 'AssignedAt', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'تاريخ تعيين الصلاحية', descriptionEn: 'Assignment timestamp' }
    ]
  },

  // 18. AuditLogs
  {
    name: 'AuditLogs',
    nameAr: 'سجل العمليات والتدقيق',
    nameEn: 'Audit & Activity Logs',
    groupId: 'users_audit',
    primaryKey: 'AuditLogId',
    descriptionAr: 'السجل الرقابي غير القابل للتعديل الذي يوثق كافة العمليات والتغييرات الحساسة بالدليل والقيود',
    descriptionEn: 'Immutable audit trail capturing all system modifications, prior values, and actors',
    defaultPosition: { x: 1120, y: 1800 },
    columns: [
      { name: 'AuditLogId', type: 'BIGINT', isPrimary: true, isNullable: false, descriptionAr: 'المفتاح الأساسي لحدث التدقيق', descriptionEn: 'Primary Key' },
      { 
        name: 'UserId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: false, 
        foreignRef: { table: 'Users', column: 'UserId', onDelete: 'RESTRICT' },
        descriptionAr: 'المستخدم الذي نفذ العملية', 
        descriptionEn: 'Actor user identifier' 
      },
      { 
        name: 'CompanyId', 
        type: 'INT', 
        isForeign: true, 
        isNullable: true, 
        foreignRef: { table: 'Companies', column: 'CompanyId', onDelete: 'SET NULL' },
        descriptionAr: 'الشركة المعنية بالعملية', 
        descriptionEn: 'Company context' 
      },
      { name: 'TableName', type: 'VARCHAR(100)', isNullable: false, descriptionAr: 'اسم الجدول المستهدف بالتعديل', descriptionEn: 'Target modified table name' },
      { name: 'RecordId', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'معرف السجل المتأثر بالعملية', descriptionEn: 'Target record Primary Key' },
      { name: 'ActionType', type: 'VARCHAR(50)', isNullable: false, descriptionAr: 'نوع العملية (INSERT, UPDATE, DELETE, POST, REVERSE)', descriptionEn: 'Action type' },
      { name: 'OldValue', type: 'TEXT', isNullable: true, descriptionAr: 'القيم السابقة قبل التغيير (JSON/Text)', descriptionEn: 'State before mutation' },
      { name: 'NewValue', type: 'TEXT', isNullable: true, descriptionAr: 'القيم الجديدة بعد التغيير (JSON/Text)', descriptionEn: 'State after mutation' },
      { name: 'ActionDate', type: 'DATETIME', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', descriptionAr: 'توقيت تنفيذ العملية بدقة', descriptionEn: 'Action execution timestamp' },
      { name: 'Notes', type: 'TEXT', isNullable: true, descriptionAr: 'ملاحظات إضافية أو سبب التعديل', descriptionEn: 'Additional contextual notes' }
    ]
  }
];
