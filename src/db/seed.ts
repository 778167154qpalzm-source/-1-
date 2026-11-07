export const INITIAL_DATABASE_DATA: Record<string, Record<string, any>[]> = {
  // 1. Companies
  Companies: [
    {
      CompanyId: 1,
      CompanyCode: 'ALOFUQ',
      CompanyName: 'شركة الأفق للتقنية والحلول المالية الذكية',
      CommercialRegistration: '1010892011',
      TaxNumber: '310928374600003',
      Address: 'المملكة العربية السعودية، الرياض، طريق الملك فهد',
      Phone: '+966 11 482 9900',
      Email: 'info@alofuq-tech.sa',
      BaseCurrencyId: 1,
      IsActive: true,
      CreatedAt: '2025-01-01 08:00:00'
    },
    {
      CompanyId: 2,
      CompanyCode: 'ALNOOR',
      CompanyName: 'مجموعة النور التجارية القابضة',
      CommercialRegistration: '4030781290',
      TaxNumber: '300482910400003',
      Address: 'المملكة العربية السعودية، جدة، حي الروضة',
      Phone: '+966 12 660 4411',
      Email: 'finance@alnoor-group.sa',
      BaseCurrencyId: 1,
      IsActive: true,
      CreatedAt: '2025-03-15 09:30:00'
    }
  ],

  // 2. AccountTypes
  AccountTypes: [
    {
      AccountTypeId: 1,
      TypeCode: '1',
      TypeNameAr: 'الأصول',
      TypeNameEn: 'Assets',
      Description: 'الموارد الاقتصادية التي تسيطر عليها المنشأة وتقدم منافع مستقبلية (الميزانية العمومية)',
      IsActive: true
    },
    {
      AccountTypeId: 2,
      TypeCode: '2',
      TypeNameAr: 'الخصوم (الالتزامات)',
      TypeNameEn: 'Liabilities',
      Description: 'التعهدات الحالية على المنشأة والديون المستحقة للغير (الميزانية العمومية)',
      IsActive: true
    },
    {
      AccountTypeId: 3,
      TypeCode: '3',
      TypeNameAr: 'حقوق الملكية',
      TypeNameEn: 'Equity',
      Description: 'الحصة المتبقية في أصول المنشأة بعد خصم جميع التزاماتها (الميزانية العمومية)',
      IsActive: true
    },
    {
      AccountTypeId: 4,
      TypeCode: '4',
      TypeNameAr: 'الإيرادات',
      TypeNameEn: 'Revenue',
      Description: 'التدفقات النقدية الداخلة والزيادات في الأصول الناتجة عن ممارسة النشاط (قائمة الدخل)',
      IsActive: true
    },
    {
      AccountTypeId: 5,
      TypeCode: '5',
      TypeNameAr: 'المصروفات',
      TypeNameEn: 'Expenses',
      Description: 'التدفقات النقدية الخارجة وتكلفة الموارد المستنفدة لتوليد الإيرادات (قائمة الدخل)',
      IsActive: true
    }
  ],

  // 3. AccountNature
  AccountNature: [
    {
      AccountNatureId: 1,
      NatureCode: 'DR',
      NatureNameAr: 'مدين',
      NatureNameEn: 'Debit',
      NormalBalance: 'Debit',
      Description: 'يزيد بالجانب المدين وينقص بالجانب الدائن (الأصول والمصروفات بطبيعتها مدينة)'
    },
    {
      AccountNatureId: 2,
      NatureCode: 'CR',
      NatureNameAr: 'دائن',
      NatureNameEn: 'Credit',
      NormalBalance: 'Credit',
      Description: 'يزيد بالجانب الدائن وينقص بالجانب المدين (الخصوم وحقوق الملكية والإيرادات دائنة)'
    }
  ],

  // 4. AccountLevels
  AccountLevels: [
    {
      AccountLevelId: 1,
      LevelNumber: 1,
      LevelNameAr: 'المستوى الأول: أبواب الدليل الرئيسية',
      LevelNameEn: 'Level 1: Master Groups',
      CodeLength: 1,
      Description: 'الحسابات الخمسة الرئيسية الأساسية (1 إلى 5) لا يقبل الترحيل المباشر'
    },
    {
      AccountLevelId: 2,
      LevelNumber: 2,
      LevelNameAr: 'المستوى الثاني: المجموعات العامة',
      LevelNameEn: 'Level 2: Major Subgroups',
      CodeLength: 2,
      Description: 'تصنيفات رئيسية مثل الأصول المتداولة والخصوم المتداولة (رمز من خانتين)'
    },
    {
      AccountLevelId: 3,
      LevelNumber: 3,
      LevelNameAr: 'المستوى الثالث: الحسابات التجميعية',
      LevelNameEn: 'Level 3: Aggregate Accounts',
      CodeLength: 4,
      Description: 'حسابات فرعية تجميعية مثل النقدية، العملاء، الموردين (رمز من 4 خانات)'
    },
    {
      AccountLevelId: 4,
      LevelNumber: 4,
      LevelNameAr: 'المستوى الرابع: الحسابات التشغيلية المباشرة',
      LevelNameEn: 'Level 4: Operational Ledger Accounts',
      CodeLength: 6,
      Description: 'حسابات دفتر الأستاذ الفعالة التي يقبل النظام إجراء القيود اليومية عليها'
    },
    {
      AccountLevelId: 5,
      LevelNumber: 5,
      LevelNameAr: 'المستوى الخامس: الحسابات التحليلية التفصيلية',
      LevelNameEn: 'Level 5: Detailed Analytic Accounts',
      CodeLength: 8,
      Description: 'حسابات فرعية لأقصى درجات التفصيل المحاسبي والرقابي'
    }
  ],

  // 5. AccountCategories
  AccountCategories: [
    {
      AccountCategoryId: 1,
      CategoryCode: 'CAT-CASH',
      CategoryNameAr: 'النقدية وما في حكمها',
      CategoryNameEn: 'Cash & Cash Equivalents',
      Description: 'الصناديق والبنوك والودائع تحت الطلب',
      IsActive: true
    },
    {
      AccountCategoryId: 2,
      CategoryCode: 'CAT-AR',
      CategoryNameAr: 'العملاء والذمم المدينة التجارية',
      CategoryNameEn: 'Accounts Receivable & Debtors',
      Description: 'المستحقات على عملاء المبيعات والخدمات',
      IsActive: true
    },
    {
      AccountCategoryId: 3,
      CategoryCode: 'CAT-INV',
      CategoryNameAr: 'المخزون السلعي وبضاعة المستودع',
      CategoryNameEn: 'Merchandise Inventory',
      Description: 'البضائع المعدة للبيع ومستلزمات التشغيل',
      IsActive: true
    },
    {
      AccountCategoryId: 4,
      CategoryCode: 'CAT-FA',
      CategoryNameAr: 'الأصول الثابتة والممتلكات',
      CategoryNameEn: 'Property, Plant & Equipment',
      Description: 'العقارات والسيارات والأجهزة والآلات طويلة الأجل',
      IsActive: true
    },
    {
      AccountCategoryId: 5,
      CategoryCode: 'CAT-AP',
      CategoryNameAr: 'الموردون والذمم الدائنة التجارية',
      CategoryNameEn: 'Accounts Payable & Creditors',
      Description: 'الالتزامات المالية للموردين ومقدمي الخدمات',
      IsActive: true
    },
    {
      AccountCategoryId: 6,
      CategoryCode: 'CAT-TAX',
      CategoryNameAr: 'الضرائب والمستحقات النظامية',
      CategoryNameEn: 'Taxes & Statutory Dues',
      Description: 'ضريبة القيمة المضافة والتأمينات والزكاة الشرعية',
      IsActive: true
    },
    {
      AccountCategoryId: 7,
      CategoryCode: 'CAT-EQUITY',
      CategoryNameAr: 'رأس المال والاحتياطيات والأرباح',
      CategoryNameEn: 'Share Capital & Reserves',
      Description: 'استثمارات الملاك والأرباح المحتجزة',
      IsActive: true
    },
    {
      AccountCategoryId: 8,
      CategoryCode: 'CAT-REV',
      CategoryNameAr: 'إيرادات العمليات والنشاط',
      CategoryNameEn: 'Operating Revenues',
      Description: 'عوائد بيع المنتجات وتقديم الخدمات الاستشارية',
      IsActive: true
    },
    {
      AccountCategoryId: 9,
      CategoryCode: 'CAT-GA',
      CategoryNameAr: 'المصروفات العمومية والإدارية',
      CategoryNameEn: 'General & Administrative Expenses',
      Description: 'الرواتب والأجور والإيجارات والاتصالات والمنافع',
      IsActive: true
    }
  ],

  // 6. ChartOfAccounts
  ChartOfAccounts: [
    // 1 - Assets
    {
      AccountId: 1,
      CompanyId: 1,
      AccountCode: '1',
      AccountNameAr: 'الأصول',
      AccountNameEn: 'Assets',
      ParentAccountId: null,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 1,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'الباب الأول لكافة أصول وممتلكات الشركة',
      CreatedAt: '2025-01-01 08:00:00',
      UpdatedAt: '2025-01-01 08:00:00'
    },
    {
      AccountId: 2,
      CompanyId: 1,
      AccountCode: '11',
      AccountNameAr: 'الأصول المتداولة',
      AccountNameEn: 'Current Assets',
      ParentAccountId: 1,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 2,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'الأصول القابلة للتحويل إلى نقدية خلال دورة تشغيلية أو سنة',
      CreatedAt: '2025-01-01 08:05:00',
      UpdatedAt: '2025-01-01 08:05:00'
    },
    {
      AccountId: 3,
      CompanyId: 1,
      AccountCode: '1101',
      AccountNameAr: 'النقدية وما في حكمها',
      AccountNameEn: 'Cash & Cash Equivalents',
      ParentAccountId: 2,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 3,
      AccountCategoryId: 1,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'حساب تجميعي للأرصدة النقدية والحسابات البنكية',
      CreatedAt: '2025-01-01 08:10:00',
      UpdatedAt: '2025-01-01 08:10:00'
    },
    {
      AccountId: 4,
      CompanyId: 1,
      AccountCode: '110101',
      AccountNameAr: 'الصندوق الرئيسي (الخزينة المركزية)',
      AccountNameEn: 'Main Petty Cash Fund',
      ParentAccountId: 3,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 1,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'النقدية المتوفرة بالخزينة للمصروفات النثرية والعهد اليومية',
      CreatedAt: '2025-01-01 08:15:00',
      UpdatedAt: '2025-01-01 08:15:00'
    },
    {
      AccountId: 5,
      CompanyId: 1,
      AccountCode: '110102',
      AccountNameAr: 'حساب البنك الأهلي السعودي (SNB)',
      AccountNameEn: 'Saudi National Bank - Main SAR',
      ParentAccountId: 3,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 1,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'الحساب الجاري الرئيسي للشركة بالعملة الأساسية (ريال سعودي)',
      CreatedAt: '2025-01-01 08:18:00',
      UpdatedAt: '2025-01-01 08:18:00'
    },
    {
      AccountId: 6,
      CompanyId: 1,
      AccountCode: '110103',
      AccountNameAr: 'حساب مصرف الراجحي - استثماري',
      AccountNameEn: 'Al Rajhi Bank - Corporate',
      ParentAccountId: 3,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 1,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'حساب التحصيلات والعمليات الإلكترونية',
      CreatedAt: '2025-01-01 08:20:00',
      UpdatedAt: '2025-01-01 08:20:00'
    },
    {
      AccountId: 7,
      CompanyId: 1,
      AccountCode: '1102',
      AccountNameAr: 'العملاء والذمم المدينة',
      AccountNameEn: 'Accounts Receivable',
      ParentAccountId: 2,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 3,
      AccountCategoryId: 2,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'حساب تجميعي لأرصدة مديني الشركة والعملاء',
      CreatedAt: '2025-01-01 08:25:00',
      UpdatedAt: '2025-01-01 08:25:00'
    },
    {
      AccountId: 8,
      CompanyId: 1,
      AccountCode: '110201',
      AccountNameAr: 'ذمم العملاء التجاريين - محلي',
      AccountNameEn: 'Local Trade Customers',
      ParentAccountId: 7,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 2,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'فواتير المبيعات الآجلة للشركات المحلية',
      CreatedAt: '2025-01-01 08:30:00',
      UpdatedAt: '2025-01-01 08:30:00'
    },
    {
      AccountId: 9,
      CompanyId: 1,
      AccountCode: '1103',
      AccountNameAr: 'المخزون السلعي',
      AccountNameEn: 'Merchandise Inventory',
      ParentAccountId: 2,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 3,
      AccountCategoryId: 3,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'مخزون المستودعات للبيع والتشغيل',
      CreatedAt: '2025-01-01 08:35:00',
      UpdatedAt: '2025-01-01 08:35:00'
    },
    {
      AccountId: 10,
      CompanyId: 1,
      AccountCode: '110301',
      AccountNameAr: 'مستودع الأجهزة والعتاد التقني',
      AccountNameEn: 'Hardware & Devices Warehouse',
      ParentAccountId: 9,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 3,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'أجهزة الخوادم والشبكات المعدة للبيع والتوزيع',
      CreatedAt: '2025-01-01 08:40:00',
      UpdatedAt: '2025-01-01 08:40:00'
    },
    {
      AccountId: 11,
      CompanyId: 1,
      AccountCode: '12',
      AccountNameAr: 'الأصول غير المتداولة (الثابتة)',
      AccountNameEn: 'Non-Current Assets',
      ParentAccountId: 1,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 2,
      AccountCategoryId: 4,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'الممتلكات والمعدات والمصانع طويلة الأجل',
      CreatedAt: '2025-01-01 08:45:00',
      UpdatedAt: '2025-01-01 08:45:00'
    },
    {
      AccountId: 12,
      CompanyId: 1,
      AccountCode: '120101',
      AccountNameAr: 'المباني والعقارات الإدارية',
      AccountNameEn: 'Buildings & Real Estate',
      ParentAccountId: 11,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 4,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'مقر الشركة والمباني المملوكة',
      CreatedAt: '2025-01-01 08:50:00',
      UpdatedAt: '2025-01-01 08:50:00'
    },
    {
      AccountId: 13,
      CompanyId: 1,
      AccountCode: '120201',
      AccountNameAr: 'أجهزة الحاسب والشبكات والمعدات',
      AccountNameEn: 'IT Hardware & Office Equipment',
      ParentAccountId: 11,
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 4,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'أجهزة الموظفين وشبكات الداتا والمخدمات',
      CreatedAt: '2025-01-01 08:55:00',
      UpdatedAt: '2025-01-01 08:55:00'
    },

    // 2 - Liabilities
    {
      AccountId: 14,
      CompanyId: 1,
      AccountCode: '2',
      AccountNameAr: 'الخصوم (الالتزامات)',
      AccountNameEn: 'Liabilities',
      ParentAccountId: null,
      AccountTypeId: 2,
      AccountNatureId: 2,
      AccountLevelId: 1,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'التزامات الشركة وديونها تجاه الموردين والجهات الدائنة',
      CreatedAt: '2025-01-01 09:00:00',
      UpdatedAt: '2025-01-01 09:00:00'
    },
    {
      AccountId: 15,
      CompanyId: 1,
      AccountCode: '21',
      AccountNameAr: 'الخصوم المتداولة',
      AccountNameEn: 'Current Liabilities',
      ParentAccountId: 14,
      AccountTypeId: 2,
      AccountNatureId: 2,
      AccountLevelId: 2,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'الالتزامات واجبة السداد خلال السنة المالية الحالية',
      CreatedAt: '2025-01-01 09:05:00',
      UpdatedAt: '2025-01-01 09:05:00'
    },
    {
      AccountId: 16,
      CompanyId: 1,
      AccountCode: '210101',
      AccountNameAr: 'ذمم الموردين التجاريين',
      AccountNameEn: 'Trade Accounts Payable',
      ParentAccountId: 15,
      AccountTypeId: 2,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 5,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'فواتير مشتريات الخدمات ومستلزمات التقنية المستحقة',
      CreatedAt: '2025-01-01 09:10:00',
      UpdatedAt: '2025-01-01 09:10:00'
    },
    {
      AccountId: 17,
      CompanyId: 1,
      AccountCode: '210201',
      AccountNameAr: 'أمانات ضريبة القيمة المضافة المستحقة (VAT)',
      AccountNameEn: 'VAT Output / Payable',
      ParentAccountId: 15,
      AccountTypeId: 2,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 6,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'ضريبة القيمة المضافة المحصلة من المبيعات المستحقة للهيئة',
      CreatedAt: '2025-01-01 09:15:00',
      UpdatedAt: '2025-01-01 09:15:00'
    },

    // 3 - Equity
    {
      AccountId: 18,
      CompanyId: 1,
      AccountCode: '3',
      AccountNameAr: 'حقوق الملكية',
      AccountNameEn: 'Equity',
      ParentAccountId: null,
      AccountTypeId: 3,
      AccountNatureId: 2,
      AccountLevelId: 1,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'حقوق الشركاء والملاك وصافي أصول الشركة',
      CreatedAt: '2025-01-01 09:20:00',
      UpdatedAt: '2025-01-01 09:20:00'
    },
    {
      AccountId: 19,
      CompanyId: 1,
      AccountCode: '31',
      AccountNameAr: 'رأس المال والاحتياطيات',
      AccountNameEn: 'Capital & Reserves',
      ParentAccountId: 18,
      AccountTypeId: 3,
      AccountNatureId: 2,
      AccountLevelId: 2,
      AccountCategoryId: 7,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'حسابات رأس المال المصرح والمدفوع والاحتياطي النظامي',
      CreatedAt: '2025-01-01 09:25:00',
      UpdatedAt: '2025-01-01 09:25:00'
    },
    {
      AccountId: 20,
      CompanyId: 1,
      AccountCode: '310101',
      AccountNameAr: 'رأس المال المدفوع',
      AccountNameEn: 'Paid-in Share Capital',
      ParentAccountId: 19,
      AccountTypeId: 3,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 7,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'رأس مال الشركة وفق عقد التأسيس والسجل التجاري',
      CreatedAt: '2025-01-01 09:30:00',
      UpdatedAt: '2025-01-01 09:30:00'
    },
    {
      AccountId: 21,
      CompanyId: 1,
      AccountCode: '310201',
      AccountNameAr: 'الأرباح المبقاة (المحتجزة)',
      AccountNameEn: 'Retained Earnings',
      ParentAccountId: 19,
      AccountTypeId: 3,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 7,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'صافي الأرباح المتراكمة المدورة من السنوات السابقة',
      CreatedAt: '2025-01-01 09:35:00',
      UpdatedAt: '2025-01-01 09:35:00'
    },

    // 4 - Revenue
    {
      AccountId: 22,
      CompanyId: 1,
      AccountCode: '4',
      AccountNameAr: 'الإيرادات',
      AccountNameEn: 'Revenue',
      ParentAccountId: null,
      AccountTypeId: 4,
      AccountNatureId: 2,
      AccountLevelId: 1,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'إيرادات ممارسة النشاط الرئيسي والخدمات المقدمة للعملاء',
      CreatedAt: '2025-01-01 09:40:00',
      UpdatedAt: '2025-01-01 09:40:00'
    },
    {
      AccountId: 23,
      CompanyId: 1,
      AccountCode: '41',
      AccountNameAr: 'إيرادات المبيعات والحلول التقنية',
      AccountNameEn: 'Software & Technology Sales',
      ParentAccountId: 22,
      AccountTypeId: 4,
      AccountNatureId: 2,
      AccountLevelId: 2,
      AccountCategoryId: 8,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'إيرادات العقود والاشتراكات السحابية وتراخيص البرامج',
      CreatedAt: '2025-01-01 09:45:00',
      UpdatedAt: '2025-01-01 09:45:00'
    },
    {
      AccountId: 24,
      CompanyId: 1,
      AccountCode: '410101',
      AccountNameAr: 'إيرادات مبيعات البرمجيات والأنظمة المحاسبية',
      AccountNameEn: 'Accounting Software Subscriptions',
      ParentAccountId: 23,
      AccountTypeId: 4,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 8,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'عائدات الاشتراكات السنوية لنظام السحاب المحاسبي',
      CreatedAt: '2025-01-01 09:50:00',
      UpdatedAt: '2025-01-01 09:50:00'
    },
    {
      AccountId: 25,
      CompanyId: 1,
      AccountCode: '410201',
      AccountNameAr: 'إيرادات خدمات الاستشارات والتدريب',
      AccountNameEn: 'Consulting & Training Services',
      ParentAccountId: 23,
      AccountTypeId: 4,
      AccountNatureId: 2,
      AccountLevelId: 4,
      AccountCategoryId: 8,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'عقود التهيئة والدعم الفني والتدريب المحاسبي',
      CreatedAt: '2025-01-01 09:55:00',
      UpdatedAt: '2025-01-01 09:55:00'
    },

    // 5 - Expenses
    {
      AccountId: 26,
      CompanyId: 1,
      AccountCode: '5',
      AccountNameAr: 'المصروفات',
      AccountNameEn: 'Expenses',
      ParentAccountId: null,
      AccountTypeId: 5,
      AccountNatureId: 1,
      AccountLevelId: 1,
      AccountCategoryId: null,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'تكاليف ومصروفات التشغيل والعمليات',
      CreatedAt: '2025-01-01 10:00:00',
      UpdatedAt: '2025-01-01 10:00:00'
    },
    {
      AccountId: 27,
      CompanyId: 1,
      AccountCode: '51',
      AccountNameAr: 'المصروفات العمومية والإدارية',
      AccountNameEn: 'General & Administrative Expenses',
      ParentAccountId: 26,
      AccountTypeId: 5,
      AccountNatureId: 1,
      AccountLevelId: 2,
      AccountCategoryId: 9,
      IsParent: true,
      IsPostingAllowed: false,
      IsActive: true,
      Description: 'مصروفات الإدارة والمقرات والرواتب والتأمين',
      CreatedAt: '2025-01-01 10:05:00',
      UpdatedAt: '2025-01-01 10:05:00'
    },
    {
      AccountId: 28,
      CompanyId: 1,
      AccountCode: '510101',
      AccountNameAr: 'رواتب وأجور وبدلات الموظفين',
      AccountNameEn: 'Staff Salaries & Benefits',
      ParentAccountId: 27,
      AccountTypeId: 5,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 9,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'مسيرات الرواتب الشهرية وبدلات السكن والانتقال',
      CreatedAt: '2025-01-01 10:10:00',
      UpdatedAt: '2025-01-01 10:10:00'
    },
    {
      AccountId: 29,
      CompanyId: 1,
      AccountCode: '510201',
      AccountNameAr: 'إيجار المقرات والمكاتب',
      AccountNameEn: 'Offices Lease & Rent',
      ParentAccountId: 27,
      AccountTypeId: 5,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 9,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'عقود إيجار المكاتب والفروع السنوية',
      CreatedAt: '2025-01-01 10:15:00',
      UpdatedAt: '2025-01-01 10:15:00'
    },
    {
      AccountId: 30,
      CompanyId: 1,
      AccountCode: '510301',
      AccountNameAr: 'الكهرباء والمياه والاتصالات',
      AccountNameEn: 'Utilities & Internet Expense',
      ParentAccountId: 27,
      AccountTypeId: 5,
      AccountNatureId: 1,
      AccountLevelId: 4,
      AccountCategoryId: 9,
      IsParent: false,
      IsPostingAllowed: true,
      IsActive: true,
      Description: 'فواتير الاتصالات والإنترنت والاستضافة السحابية والمياه والكهرباء',
      CreatedAt: '2025-01-01 10:20:00',
      UpdatedAt: '2025-01-01 10:20:00'
    }
  ],

  // 7. Currencies
  Currencies: [
    {
      CurrencyId: 1,
      CurrencyCode: 'SAR',
      CurrencyNameAr: 'ريال سعودي',
      CurrencyNameEn: 'Saudi Riyal',
      CurrencySymbol: 'ر.س',
      DecimalPlaces: 2,
      IsBaseCurrency: true,
      IsActive: true
    },
    {
      CurrencyId: 2,
      CurrencyCode: 'USD',
      CurrencyNameAr: 'دولار أمريكي',
      CurrencyNameEn: 'US Dollar',
      CurrencySymbol: '$',
      DecimalPlaces: 2,
      IsBaseCurrency: false,
      IsActive: true
    },
    {
      CurrencyId: 3,
      CurrencyCode: 'EUR',
      CurrencyNameAr: 'يورو أوروبي',
      CurrencyNameEn: 'Euro',
      CurrencySymbol: '€',
      DecimalPlaces: 2,
      IsBaseCurrency: false,
      IsActive: true
    },
    {
      CurrencyId: 4,
      CurrencyCode: 'AED',
      CurrencyNameAr: 'درهم إماراتي',
      CurrencyNameEn: 'UAE Dirham',
      CurrencySymbol: 'د.إ',
      DecimalPlaces: 2,
      IsBaseCurrency: false,
      IsActive: true
    },
    {
      CurrencyId: 5,
      CurrencyCode: 'KWD',
      CurrencyNameAr: 'دينار كويتي',
      CurrencyNameEn: 'Kuwaiti Dinar',
      CurrencySymbol: 'د.ك',
      DecimalPlaces: 3,
      IsBaseCurrency: false,
      IsActive: true
    }
  ],

  // 8. FiscalYears
  FiscalYears: [
    {
      FiscalYearId: 1,
      CompanyId: 1,
      YearCode: 'FY2025',
      YearName: 'السنة المالية 2025',
      StartDate: '2025-01-01',
      EndDate: '2025-12-31',
      Status: 'Closed',
      IsClosed: true,
      CreatedAt: '2025-01-01 00:00:00'
    },
    {
      FiscalYearId: 2,
      CompanyId: 1,
      YearCode: 'FY2026',
      YearName: 'السنة المالية 2026 (الحالية)',
      StartDate: '2026-01-01',
      EndDate: '2026-12-31',
      Status: 'Open',
      IsClosed: false,
      CreatedAt: '2026-01-01 00:00:00'
    }
  ],

  // 9. FiscalPeriods
  FiscalPeriods: [
    {
      FiscalPeriodId: 1,
      FiscalYearId: 2,
      PeriodNumber: 1,
      PeriodName: 'يناير 2026',
      StartDate: '2026-01-01',
      EndDate: '2026-01-31',
      Status: 'Closed',
      IsClosed: true
    },
    {
      FiscalPeriodId: 2,
      FiscalYearId: 2,
      PeriodNumber: 2,
      PeriodName: 'فبراير 2026',
      StartDate: '2026-02-01',
      EndDate: '2026-02-28',
      Status: 'Closed',
      IsClosed: true
    },
    {
      FiscalPeriodId: 3,
      FiscalYearId: 2,
      PeriodNumber: 3,
      PeriodName: 'مارس 2026 (الفترة الجارية)',
      StartDate: '2026-03-01',
      EndDate: '2026-03-31',
      Status: 'Open',
      IsClosed: false
    },
    {
      FiscalPeriodId: 4,
      FiscalYearId: 2,
      PeriodNumber: 4,
      PeriodName: 'أبريل 2026',
      StartDate: '2026-04-01',
      EndDate: '2026-04-30',
      Status: 'Open',
      IsClosed: false
    },
    {
      FiscalPeriodId: 5,
      FiscalYearId: 2,
      PeriodNumber: 5,
      PeriodName: 'مايو 2026',
      StartDate: '2026-05-01',
      EndDate: '2026-05-31',
      Status: 'Open',
      IsClosed: false
    }
  ],

  // 10. ExchangeRates
  ExchangeRates: [
    {
      ExchangeRateId: 1,
      FromCurrencyId: 2, // USD
      ToCurrencyId: 1,   // SAR
      Rate: 3.7500,
      EffectiveDate: '2026-01-01',
      CreatedAt: '2026-01-01 00:00:00'
    },
    {
      ExchangeRateId: 2,
      FromCurrencyId: 3, // EUR
      ToCurrencyId: 1,   // SAR
      Rate: 4.0850,
      EffectiveDate: '2026-01-01',
      CreatedAt: '2026-01-01 00:00:00'
    },
    {
      ExchangeRateId: 3,
      FromCurrencyId: 4, // AED
      ToCurrencyId: 1,   // SAR
      Rate: 1.0210,
      EffectiveDate: '2026-01-01',
      CreatedAt: '2026-01-01 00:00:00'
    },
    {
      ExchangeRateId: 4,
      FromCurrencyId: 5, // KWD
      ToCurrencyId: 1,   // SAR
      Rate: 12.2200,
      EffectiveDate: '2026-01-01',
      CreatedAt: '2026-01-01 00:00:00'
    }
  ],

  // 11. CostCenters
  CostCenters: [
    {
      CostCenterId: 1,
      CompanyId: 1,
      CostCenterCode: 'CC-100',
      CostCenterNameAr: 'الإدارة العامة والمقر الرئيسي',
      CostCenterNameEn: 'Headquarters & Executive Admin',
      ParentCostCenterId: null,
      Description: 'مركز التكلفة الرئيسي للمقر والمكتب التنفيذي',
      IsActive: true,
      CreatedAt: '2025-01-01 08:00:00'
    },
    {
      CostCenterId: 2,
      CompanyId: 1,
      CostCenterCode: 'CC-110',
      CostCenterNameAr: 'قطاع تطوير التقنية والحلول السحابية',
      CostCenterNameEn: 'Technology & Cloud Solutions Dept',
      ParentCostCenterId: 1,
      Description: 'فرق البرمجة وهندسة النظم والبنية السحابية',
      IsActive: true,
      CreatedAt: '2025-01-01 08:30:00'
    },
    {
      CostCenterId: 3,
      CompanyId: 1,
      CostCenterCode: 'CC-120',
      CostCenterNameAr: 'قطاع التسويق والمبيعات وتطوير الأعمال',
      CostCenterNameEn: 'Sales & Business Development Dept',
      ParentCostCenterId: 1,
      Description: 'فريق المبيعات والحملات التسويقية وخدمة كبار العملاء',
      IsActive: true,
      CreatedAt: '2025-01-01 08:45:00'
    },
    {
      CostCenterId: 4,
      CompanyId: 1,
      CostCenterCode: 'CC-200',
      CostCenterNameAr: 'فرع المنطقة الوسطى (الرياض)',
      CostCenterNameEn: 'Central Region Hub (Riyadh)',
      ParentCostCenterId: null,
      Description: 'عمليات ومصروفات وإيرادات فرع الرياض',
      IsActive: true,
      CreatedAt: '2025-01-01 09:00:00'
    },
    {
      CostCenterId: 5,
      CompanyId: 1,
      CostCenterCode: 'CC-300',
      CostCenterNameAr: 'فرع المنطقة الغربية (جدة)',
      CostCenterNameEn: 'Western Region Hub (Jeddah)',
      ParentCostCenterId: null,
      Description: 'عمليات ومصروفات وإيرادات فرع جدة',
      IsActive: true,
      CreatedAt: '2025-01-01 09:15:00'
    }
  ],

  // 12. AccountCostCenters
  AccountCostCenters: [
    { AccountCostCenterId: 1, AccountId: 28, CostCenterId: 1, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 2, AccountId: 28, CostCenterId: 2, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 3, AccountId: 28, CostCenterId: 3, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 4, AccountId: 29, CostCenterId: 1, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 5, AccountId: 29, CostCenterId: 4, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 6, AccountId: 29, CostCenterId: 5, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 7, AccountId: 30, CostCenterId: 2, IsRequired: false, CreatedAt: '2025-01-01 10:00:00' },
    { AccountCostCenterId: 8, AccountId: 24, CostCenterId: 3, IsRequired: true, CreatedAt: '2025-01-01 10:00:00' }
  ],

  // 13. JournalEntries
  JournalEntries: [
    {
      JournalEntryId: 1,
      CompanyId: 1,
      FiscalPeriodId: 1,
      EntryNumber: 'JV-2026-0001',
      EntryDate: '2026-01-01',
      ReferenceNumber: 'OPENING-2026',
      Description: 'قيد إثبات افتتاح الأرصدة التأسيسية وإيداع رأس المال المدفوع بالبنك',
      EntryType: 'Opening',
      Status: 'Posted',
      TotalDebit: 1000000.00,
      TotalCredit: 1000000.00,
      CreatedByUserId: 1,
      ApprovedByUserId: 1,
      CreatedAt: '2026-01-01 09:00:00',
      PostedAt: '2026-01-01 09:15:00'
    },
    {
      JournalEntryId: 2,
      CompanyId: 1,
      FiscalPeriodId: 1,
      EntryNumber: 'JV-2026-0002',
      EntryDate: '2026-01-10',
      ReferenceNumber: 'RENT-INV-449',
      Description: 'قيد سداد إيجار مقر الشركة السنوي بشيك مصرفي مسحوب على البنك الأهلي',
      EntryType: 'General',
      Status: 'Posted',
      TotalDebit: 120000.00,
      TotalCredit: 120000.00,
      CreatedByUserId: 2,
      ApprovedByUserId: 1,
      CreatedAt: '2026-01-10 11:20:00',
      PostedAt: '2026-01-10 14:00:00'
    },
    {
      JournalEntryId: 3,
      CompanyId: 1,
      FiscalPeriodId: 2,
      EntryNumber: 'JV-2026-0003',
      EntryDate: '2026-02-15',
      ReferenceNumber: 'SAAS-SUB-2026-02',
      Description: 'إثبات مبيعات تراخيص سحابية لعملاء محليين مع احتساب ضريبة القيمة المضافة',
      EntryType: 'General',
      Status: 'Approved',
      TotalDebit: 345000.00,
      TotalCredit: 345000.00,
      CreatedByUserId: 2,
      ApprovedByUserId: 1,
      CreatedAt: '2026-02-15 13:45:00',
      PostedAt: null
    },
    {
      JournalEntryId: 4,
      CompanyId: 1,
      FiscalPeriodId: 2,
      EntryNumber: 'JV-2026-0004',
      EntryDate: '2026-02-28',
      ReferenceNumber: 'PAYROLL-FEB-26',
      Description: 'قيد إثبات وصرف مسير رواتب موظفي قطاع تقنية المعلومات والمبيعات',
      EntryType: 'General',
      Status: 'Posted',
      TotalDebit: 85000.00,
      TotalCredit: 85000.00,
      CreatedByUserId: 2,
      ApprovedByUserId: 1,
      CreatedAt: '2026-02-28 16:10:00',
      PostedAt: '2026-02-28 17:00:00'
    },
    {
      JournalEntryId: 5,
      CompanyId: 1,
      FiscalPeriodId: 3,
      EntryNumber: 'JV-2026-0005',
      EntryDate: '2026-03-05',
      ReferenceNumber: 'CLOUD-HOST-03',
      Description: 'مسودة قيد استحقاق فواتير الاستضافة السحابية والاتصالات',
      EntryType: 'General',
      Status: 'Draft',
      TotalDebit: 14500.00,
      TotalCredit: 14500.00,
      CreatedByUserId: 4,
      ApprovedByUserId: null,
      CreatedAt: '2026-03-05 10:25:00',
      PostedAt: null
    }
  ],

  // 14. JournalEntryLines
  JournalEntryLines: [
    // Entry 1 lines: Bank (Debit) 1,000,000 / Capital (Credit) 1,000,000
    {
      JournalEntryLineId: 1,
      JournalEntryId: 1,
      AccountId: 5, // Bank SNB
      CostCenterId: 1,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'إيداع رأس مال الشركاء بالحساب البنكي',
      DebitAmount: 1000000.00,
      CreditAmount: 0.00,
      BaseDebitAmount: 1000000.00,
      BaseCreditAmount: 0.00,
      LineNumber: 1
    },
    {
      JournalEntryLineId: 2,
      JournalEntryId: 1,
      AccountId: 20, // Capital
      CostCenterId: null,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'إثبات رأس المال المدفوع للشركة',
      DebitAmount: 0.00,
      CreditAmount: 1000000.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 1000000.00,
      LineNumber: 2
    },

    // Entry 2 lines: Rent Expense 120,000 / Bank SNB 120,000
    {
      JournalEntryLineId: 3,
      JournalEntryId: 2,
      AccountId: 29, // Rent
      CostCenterId: 1,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'إيجار سنوي للمقر الإداري',
      DebitAmount: 120000.00,
      CreditAmount: 0.00,
      BaseDebitAmount: 120000.00,
      BaseCreditAmount: 0.00,
      LineNumber: 1
    },
    {
      JournalEntryLineId: 4,
      JournalEntryId: 2,
      AccountId: 5, // Bank SNB
      CostCenterId: null,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'خصم قيمة الشيك من حساب البنك الأهلي',
      DebitAmount: 0.00,
      CreditAmount: 120000.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 120000.00,
      LineNumber: 2
    },

    // Entry 3 lines: AR Debtors 345,000 / Sales Revenue 300,000 + VAT 45,000
    {
      JournalEntryLineId: 5,
      JournalEntryId: 3,
      AccountId: 8, // AR Local Customers
      CostCenterId: 3,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'مستحقات فواتير مبيعات آجلة على العملاء',
      DebitAmount: 345000.00,
      CreditAmount: 0.00,
      BaseDebitAmount: 345000.00,
      BaseCreditAmount: 0.00,
      LineNumber: 1
    },
    {
      JournalEntryLineId: 6,
      JournalEntryId: 3,
      AccountId: 24, // Software Sales Revenue
      CostCenterId: 3,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'إيراد مبيعات تراخيص سحابية',
      DebitAmount: 0.00,
      CreditAmount: 300000.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 300000.00,
      LineNumber: 2
    },
    {
      JournalEntryLineId: 7,
      JournalEntryId: 3,
      AccountId: 17, // VAT Output
      CostCenterId: null,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'ضريبة القيمة المضافة 15%',
      DebitAmount: 0.00,
      CreditAmount: 45000.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 45000.00,
      LineNumber: 3
    },

    // Entry 4 lines: Salaries 85,000 / Bank SNB 85,000
    {
      JournalEntryLineId: 8,
      JournalEntryId: 4,
      AccountId: 28, // Salaries
      CostCenterId: 2,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'رواتب موظفي التطوير التقني والإدارة',
      DebitAmount: 85000.00,
      CreditAmount: 0.00,
      BaseDebitAmount: 85000.00,
      BaseCreditAmount: 0.00,
      LineNumber: 1
    },
    {
      JournalEntryLineId: 9,
      JournalEntryId: 4,
      AccountId: 5, // Bank SNB
      CostCenterId: null,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'تحويل الرواتب للموظفين عبر البنك',
      DebitAmount: 0.00,
      CreditAmount: 85000.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 85000.00,
      LineNumber: 2
    },

    // Entry 5 lines: Utilities 14,500 / Trade AP 14,500
    {
      JournalEntryLineId: 10,
      JournalEntryId: 5,
      AccountId: 30, // Utilities
      CostCenterId: 2,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'استحقاق تكلفة خدمات الخوادم والاتصالات',
      DebitAmount: 14500.00,
      CreditAmount: 0.00,
      BaseDebitAmount: 14500.00,
      BaseCreditAmount: 0.00,
      LineNumber: 1
    },
    {
      JournalEntryLineId: 11,
      JournalEntryId: 5,
      AccountId: 16, // Trade AP
      CostCenterId: null,
      CurrencyId: 1,
      ExchangeRate: 1.0,
      Description: 'مستحقات مزود خدمات الاستضافة السحابية',
      DebitAmount: 0.00,
      CreditAmount: 14500.00,
      BaseDebitAmount: 0.00,
      BaseCreditAmount: 14500.00,
      LineNumber: 2
    }
  ],

  // 15. AccountBalances
  AccountBalances: [
    {
      AccountBalanceId: 1,
      AccountId: 5, // Bank SNB
      FiscalPeriodId: 1,
      CurrencyId: 1,
      OpeningDebit: 0.00,
      OpeningCredit: 0.00,
      PeriodDebit: 1000000.00,
      PeriodCredit: 120000.00,
      ClosingDebit: 880000.00,
      ClosingCredit: 0.00,
      LastUpdatedAt: '2026-01-31 23:59:59'
    },
    {
      AccountBalanceId: 2,
      AccountId: 20, // Capital
      FiscalPeriodId: 1,
      CurrencyId: 1,
      OpeningDebit: 0.00,
      OpeningCredit: 0.00,
      PeriodDebit: 0.00,
      PeriodCredit: 1000000.00,
      ClosingDebit: 0.00,
      ClosingCredit: 1000000.00,
      LastUpdatedAt: '2026-01-31 23:59:59'
    },
    {
      AccountBalanceId: 3,
      AccountId: 29, // Rent
      FiscalPeriodId: 1,
      CurrencyId: 1,
      OpeningDebit: 0.00,
      OpeningCredit: 0.00,
      PeriodDebit: 120000.00,
      PeriodCredit: 0.00,
      ClosingDebit: 120000.00,
      ClosingCredit: 0.00,
      LastUpdatedAt: '2026-01-31 23:59:59'
    },
    {
      AccountBalanceId: 4,
      AccountId: 5, // Bank SNB
      FiscalPeriodId: 2,
      CurrencyId: 1,
      OpeningDebit: 880000.00,
      OpeningCredit: 0.00,
      PeriodDebit: 0.00,
      PeriodCredit: 85000.00,
      ClosingDebit: 795000.00,
      ClosingCredit: 0.00,
      LastUpdatedAt: '2026-02-28 23:59:59'
    },
    {
      AccountBalanceId: 5,
      AccountId: 28, // Salaries
      FiscalPeriodId: 2,
      CurrencyId: 1,
      OpeningDebit: 0.00,
      OpeningCredit: 0.00,
      PeriodDebit: 85000.00,
      PeriodCredit: 0.00,
      ClosingDebit: 85000.00,
      ClosingCredit: 0.00,
      LastUpdatedAt: '2026-02-28 23:59:59'
    }
  ],

  // 16. Users
  Users: [
    {
      UserId: 1,
      Username: 'admin_abdullah',
      FullName: 'عبدالله السعيد',
      Email: 'a.saeed@alofuq-tech.sa',
      Phone: '+966 50 123 4567',
      PasswordHash: '$2b$12$e82a...encrypted_hash_placeholder',
      IsActive: true,
      CreatedAt: '2025-01-01 08:00:00',
      LastLoginAt: '2026-11-06 09:15:22'
    },
    {
      UserId: 2,
      Username: 'chief_fatima',
      FullName: 'فاطمة العتيبي',
      Email: 'f.otaibi@alofuq-tech.sa',
      Phone: '+966 55 987 6543',
      PasswordHash: '$2b$12$7k2p...encrypted_hash_placeholder',
      IsActive: true,
      CreatedAt: '2025-01-05 09:00:00',
      LastLoginAt: '2026-11-06 08:30:10'
    },
    {
      UserId: 3,
      Username: 'auditor_khaled',
      FullName: 'خالد الدوسري (مدقق معتمد)',
      Email: 'k.dosari@audit-firm.sa',
      Phone: '+966 54 222 3344',
      PasswordHash: '$2b$12$9q1x...encrypted_hash_placeholder',
      IsActive: true,
      CreatedAt: '2025-02-01 10:00:00',
      LastLoginAt: '2026-11-05 14:20:00'
    },
    {
      UserId: 4,
      Username: 'entry_yasser',
      FullName: 'ياسر الشمري',
      Email: 'y.shammari@alofuq-tech.sa',
      Phone: '+966 56 333 7788',
      PasswordHash: '$2b$12$1p0m...encrypted_hash_placeholder',
      IsActive: true,
      CreatedAt: '2025-03-01 11:30:00',
      LastLoginAt: '2026-11-06 11:05:44'
    }
  ],

  // 17. CompanyUsers
  CompanyUsers: [
    {
      CompanyUserId: 1,
      CompanyId: 1,
      UserId: 1,
      RoleName: 'SuperAdmin',
      IsActive: true,
      AssignedAt: '2025-01-01 08:00:00'
    },
    {
      CompanyUserId: 2,
      CompanyId: 1,
      UserId: 2,
      RoleName: 'ChiefAccountant',
      IsActive: true,
      AssignedAt: '2025-01-05 09:00:00'
    },
    {
      CompanyUserId: 3,
      CompanyId: 1,
      UserId: 3,
      RoleName: 'Auditor',
      IsActive: true,
      AssignedAt: '2025-02-01 10:00:00'
    },
    {
      CompanyUserId: 4,
      CompanyId: 1,
      UserId: 4,
      RoleName: 'DataEntry',
      IsActive: true,
      AssignedAt: '2025-03-01 11:30:00'
    },
    {
      CompanyUserId: 5,
      CompanyId: 2,
      UserId: 1,
      RoleName: 'SuperAdmin',
      IsActive: true,
      AssignedAt: '2025-03-15 09:30:00'
    }
  ],

  // 18. AuditLogs
  AuditLogs: [
    {
      AuditLogId: 1,
      UserId: 1,
      CompanyId: 1,
      TableName: 'ChartOfAccounts',
      RecordId: '4',
      ActionType: 'INSERT',
      OldValue: null,
      NewValue: '{"AccountCode":"110101","AccountNameAr":"الصندوق الرئيسي","AccountLevelId":4}',
      ActionDate: '2025-01-01 08:15:00',
      Notes: 'تأسيس حساب الصندوق الرئيسي بدليل الحسابات'
    },
    {
      AuditLogId: 2,
      UserId: 1,
      CompanyId: 1,
      TableName: 'JournalEntries',
      RecordId: '1',
      ActionType: 'POST',
      OldValue: '{"Status":"Draft"}',
      NewValue: '{"Status":"Posted","PostedAt":"2026-01-01 09:15:00"}',
      ActionDate: '2026-01-01 09:15:00',
      Notes: 'اعتماد وترحيل قيد افتتاح رأس المال JV-2026-0001'
    },
    {
      AuditLogId: 3,
      UserId: 2,
      CompanyId: 1,
      TableName: 'JournalEntries',
      RecordId: '2',
      ActionType: 'POST',
      OldValue: '{"Status":"Pending"}',
      NewValue: '{"Status":"Posted"}',
      ActionDate: '2026-01-10 14:00:00',
      Notes: 'ترحيل قيد سداد الإيجار السنوي'
    },
    {
      AuditLogId: 4,
      UserId: 2,
      CompanyId: 1,
      TableName: 'ExchangeRates',
      RecordId: '2',
      ActionType: 'UPDATE',
      OldValue: '{"Rate":4.0500}',
      NewValue: '{"Rate":4.0850}',
      ActionDate: '2026-01-15 10:00:00',
      Notes: 'تحديث سعر صرف اليورو أمام الريال السعودي'
    },
    {
      AuditLogId: 5,
      UserId: 1,
      CompanyId: 1,
      TableName: 'FiscalPeriods',
      RecordId: '1',
      ActionType: 'UPDATE',
      OldValue: '{"Status":"Open","IsClosed":false}',
      NewValue: '{"Status":"Closed","IsClosed":true}',
      ActionDate: '2026-02-05 18:00:00',
      Notes: 'إقفال الفترة المحاسبية لشهر يناير 2026'
    },
    {
      AuditLogId: 6,
      UserId: 2,
      CompanyId: 1,
      TableName: 'JournalEntries',
      RecordId: '3',
      ActionType: 'APPROVE',
      OldValue: '{"Status":"Pending"}',
      NewValue: '{"Status":"Approved"}',
      ActionDate: '2026-02-16 11:30:00',
      Notes: 'اعتماد قيد مبيعات التراخيص السحابية'
    }
  ]
};
