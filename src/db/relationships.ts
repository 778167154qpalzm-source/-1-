import { Relationship } from '../types';

export const RELATIONSHIPS: Relationship[] = [
  // 1. Company -> Currency
  {
    id: 'rel_company_currency',
    sourceTable: 'Companies',
    sourceColumn: 'BaseCurrencyId',
    targetTable: 'Currencies',
    targetColumn: 'CurrencyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'العملة الأساسية للتقارير بالشركة',
    labelEn: 'Company functional base currency'
  },
  // 2. Company -> Accounts
  {
    id: 'rel_account_company',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الشركة المالكة لدليل الحسابات',
    labelEn: 'Company owns accounts in chart'
  },
  // 3. Recursive Account -> Parent Account
  {
    id: 'rel_account_parent',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'ParentAccountId',
    targetTable: 'ChartOfAccounts',
    targetColumn: 'AccountId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'علاقة هرمية ذاتية: الحساب الأب بالأبناء',
    labelEn: 'Self-referencing tree: Parent to child accounts',
    isSelfReferential: true
  },
  // 4. Account -> Type
  {
    id: 'rel_account_type',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'AccountTypeId',
    targetTable: 'AccountTypes',
    targetColumn: 'AccountTypeId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'نوع الحساب (أصول، خصوم، ملكية...)',
    labelEn: 'Account classification type'
  },
  // 5. Account -> Nature
  {
    id: 'rel_account_nature',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'AccountNatureId',
    targetTable: 'AccountNature',
    targetColumn: 'AccountNatureId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'طبيعة الحساب (مدين / دائن)',
    labelEn: 'Account normal balance nature'
  },
  // 6. Account -> Level
  {
    id: 'rel_account_level',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'AccountLevelId',
    targetTable: 'AccountLevels',
    targetColumn: 'AccountLevelId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'مستوى الحساب في العمق الهرمي',
    labelEn: 'Hierarchical depth level of account'
  },
  // 7. Account -> Category
  {
    id: 'rel_account_category',
    sourceTable: 'ChartOfAccounts',
    sourceColumn: 'AccountCategoryId',
    targetTable: 'AccountCategories',
    targetColumn: 'AccountCategoryId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'تصنيف المجموعة الفرعية للقوائم',
    labelEn: 'Financial statement subgroup category'
  },
  // 8. Company -> FiscalYears
  {
    id: 'rel_year_company',
    sourceTable: 'FiscalYears',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'السنوات المالية التابعة للشركة',
    labelEn: 'Company fiscal years'
  },
  // 9. FiscalYear -> FiscalPeriods
  {
    id: 'rel_period_year',
    sourceTable: 'FiscalPeriods',
    sourceColumn: 'FiscalYearId',
    targetTable: 'FiscalYears',
    targetColumn: 'FiscalYearId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الفترات الشهرية/الربعية التابعة للسنة',
    labelEn: 'Periods within fiscal year'
  },
  // 10. ExchangeRates -> Currencies (From)
  {
    id: 'rel_rate_from_currency',
    sourceTable: 'ExchangeRates',
    sourceColumn: 'FromCurrencyId',
    targetTable: 'Currencies',
    targetColumn: 'CurrencyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'العملة المصدر للتحويل',
    labelEn: 'Source currency conversion'
  },
  // 11. ExchangeRates -> Currencies (To)
  {
    id: 'rel_rate_to_currency',
    sourceTable: 'ExchangeRates',
    sourceColumn: 'ToCurrencyId',
    targetTable: 'Currencies',
    targetColumn: 'CurrencyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'العملة الهدف للتحويل',
    labelEn: 'Target currency conversion'
  },
  // 12. Company -> CostCenters
  {
    id: 'rel_center_company',
    sourceTable: 'CostCenters',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'مراكز التكلفة التابعة للشركة',
    labelEn: 'Company analytical cost centers'
  },
  // 13. Recursive CostCenter -> Parent CostCenter
  {
    id: 'rel_center_parent',
    sourceTable: 'CostCenters',
    sourceColumn: 'ParentCostCenterId',
    targetTable: 'CostCenters',
    targetColumn: 'CostCenterId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'هيكل شجري ذاتي لمراكز التكلفة',
    labelEn: 'Self-referencing tree: Parent cost center',
    isSelfReferential: true
  },
  // 14. Junction: AccountCostCenters -> ChartOfAccounts
  {
    id: 'rel_acc_cc_account',
    sourceTable: 'AccountCostCenters',
    sourceColumn: 'AccountId',
    targetTable: 'ChartOfAccounts',
    targetColumn: 'AccountId',
    type: 'many-to-many',
    cardinality: 'N:M',
    labelAr: 'ربط متعدد إلى متعدد: الحساب بمراكز التكلفة',
    labelEn: 'M:N link: Account to allowed Cost Centers'
  },
  // 15. Junction: AccountCostCenters -> CostCenters
  {
    id: 'rel_acc_cc_center',
    sourceTable: 'AccountCostCenters',
    sourceColumn: 'CostCenterId',
    targetTable: 'CostCenters',
    targetColumn: 'CostCenterId',
    type: 'many-to-many',
    cardinality: 'N:M',
    labelAr: 'ربط متعدد إلى متعدد: المركز بالحسابات',
    labelEn: 'M:N link: Cost Center to Accounts'
  },
  // 16. Company -> JournalEntries
  {
    id: 'rel_entry_company',
    sourceTable: 'JournalEntries',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'القيود اليومية التابعة للشركة',
    labelEn: 'Company general journal vouchers'
  },
  // 17. FiscalPeriod -> JournalEntries
  {
    id: 'rel_entry_period',
    sourceTable: 'JournalEntries',
    sourceColumn: 'FiscalPeriodId',
    targetTable: 'FiscalPeriods',
    targetColumn: 'FiscalPeriodId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الفترة المالية للقيد المحاسبي',
    labelEn: 'Fiscal period posting envelope'
  },
  // 18. User -> Created JournalEntries
  {
    id: 'rel_entry_creator',
    sourceTable: 'JournalEntries',
    sourceColumn: 'CreatedByUserId',
    targetTable: 'Users',
    targetColumn: 'UserId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'المحاسب منشئ القيد',
    labelEn: 'Voucher creator user'
  },
  // 19. User -> Approved JournalEntries
  {
    id: 'rel_entry_approver',
    sourceTable: 'JournalEntries',
    sourceColumn: 'ApprovedByUserId',
    targetTable: 'Users',
    targetColumn: 'UserId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'المدير المالي المعتمد للقيد',
    labelEn: 'Voucher approving officer'
  },
  // 20. JournalEntry -> Lines
  {
    id: 'rel_line_entry',
    sourceTable: 'JournalEntryLines',
    sourceColumn: 'JournalEntryId',
    targetTable: 'JournalEntries',
    targetColumn: 'JournalEntryId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'أسطر القيد التابعة لرأس القيد',
    labelEn: 'Voucher line items'
  },
  // 21. Line -> Account
  {
    id: 'rel_line_account',
    sourceTable: 'JournalEntryLines',
    sourceColumn: 'AccountId',
    targetTable: 'ChartOfAccounts',
    targetColumn: 'AccountId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الحساب المحاسبي المتأثر بالسطر',
    labelEn: 'Line posted account'
  },
  // 22. Line -> CostCenter
  {
    id: 'rel_line_center',
    sourceTable: 'JournalEntryLines',
    sourceColumn: 'CostCenterId',
    targetTable: 'CostCenters',
    targetColumn: 'CostCenterId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'مركز التكلفة المخصص للسطر',
    labelEn: 'Analytical cost center on line'
  },
  // 23. Line -> Currency
  {
    id: 'rel_line_currency',
    sourceTable: 'JournalEntryLines',
    sourceColumn: 'CurrencyId',
    targetTable: 'Currencies',
    targetColumn: 'CurrencyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'عملة المعاملة بسطر القيد',
    labelEn: 'Transaction currency on line'
  },
  // 24. AccountBalances -> Account
  {
    id: 'rel_balance_account',
    sourceTable: 'AccountBalances',
    sourceColumn: 'AccountId',
    targetTable: 'ChartOfAccounts',
    targetColumn: 'AccountId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الحساب المرصود',
    labelEn: 'Tracked account balance'
  },
  // 25. AccountBalances -> FiscalPeriod
  {
    id: 'rel_balance_period',
    sourceTable: 'AccountBalances',
    sourceColumn: 'FiscalPeriodId',
    targetTable: 'FiscalPeriods',
    targetColumn: 'FiscalPeriodId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'فترة تجميع الرصيد المحاسبي',
    labelEn: 'Trial balance period'
  },
  // 26. AccountBalances -> Currency
  {
    id: 'rel_balance_currency',
    sourceTable: 'AccountBalances',
    sourceColumn: 'CurrencyId',
    targetTable: 'Currencies',
    targetColumn: 'CurrencyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'عملة احتساب الرصيد',
    labelEn: 'Balance currency'
  },
  // 27. Junction: CompanyUsers -> Company
  {
    id: 'rel_comp_usr_company',
    sourceTable: 'CompanyUsers',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'many-to-many',
    cardinality: 'N:M',
    labelAr: 'تعدد المستخدمين والشركات: الشركة',
    labelEn: 'Tenancy M:N: Company assignment'
  },
  // 28. Junction: CompanyUsers -> User
  {
    id: 'rel_comp_usr_user',
    sourceTable: 'CompanyUsers',
    sourceColumn: 'UserId',
    targetTable: 'Users',
    targetColumn: 'UserId',
    type: 'many-to-many',
    cardinality: 'N:M',
    labelAr: 'تعدد المستخدمين والشركات: المستخدم',
    labelEn: 'Tenancy M:N: User assignment'
  },
  // 29. AuditLog -> User
  {
    id: 'rel_audit_user',
    sourceTable: 'AuditLogs',
    sourceColumn: 'UserId',
    targetTable: 'Users',
    targetColumn: 'UserId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'المستخدم منفذ الحدث الرقابي',
    labelEn: 'Audit actor user'
  },
  // 30. AuditLog -> Company
  {
    id: 'rel_audit_company',
    sourceTable: 'AuditLogs',
    sourceColumn: 'CompanyId',
    targetTable: 'Companies',
    targetColumn: 'CompanyId',
    type: 'one-to-many',
    cardinality: '1:N',
    labelAr: 'الشركة محل إجراء الحدث',
    labelEn: 'Audit target company'
  }
];
