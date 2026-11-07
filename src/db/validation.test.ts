import test from 'node:test';
import assert from 'node:assert/strict';
import { hasHierarchicalCycle, validateChartOfAccount, canDeleteAccount, validateJournalEntry } from './validation.ts';

test('Hierarchy cycle detection prevents circular tree references', () => {
  const treeNodes = [
    { id: 1, parentId: null }, // Assets
    { id: 2, parentId: 1 },    // Current Assets
    { id: 3, parentId: 2 },    // Cash
    { id: 4, parentId: 3 }     // Petty Cash
  ];

  // Self parenting is always a cycle
  assert.equal(hasHierarchicalCycle(1, 1, treeNodes), true);

  // Trying to set 1's parent to 4 (child of child) is a cycle!
  assert.equal(hasHierarchicalCycle(1, 4, treeNodes), true);

  // Trying to set 2's parent to 3 is a cycle!
  assert.equal(hasHierarchicalCycle(2, 3, treeNodes), true);

  // Valid non-cycle: setting 4's parent to 1
  assert.equal(hasHierarchicalCycle(4, 1, treeNodes), false);

  // Valid non-cycle: setting to root (null)
  assert.equal(hasHierarchicalCycle(4, null, treeNodes), false);
});

test('Chart of account validation rejects duplicate codes in same company', () => {
  const existing = [
    { AccountId: 1, CompanyId: 1, AccountCode: '1101', AccountNameAr: 'نقدية' }
  ];

  const result = validateChartOfAccount(
    {
      CompanyId: 1,
      AccountCode: '1101',
      AccountNameAr: 'صندوق مكرر',
      AccountNameEn: 'Duplicate Cash',
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 3,
      IsParent: false,
      IsPostingAllowed: true
    },
    existing
  );

  assert.equal(result.isValid, false);
  assert.match(result.errors[0], /مستخدم بالفعل/);
});

test('Parent account cannot allow transactional posting', () => {
  const result = validateChartOfAccount(
    {
      CompanyId: 1,
      AccountCode: '1105',
      AccountNameAr: 'مجموعة جديدة',
      AccountNameEn: 'New Group',
      AccountTypeId: 1,
      AccountNatureId: 1,
      AccountLevelId: 2,
      IsParent: true,
      IsPostingAllowed: true // VIOLATION!
    },
    []
  );

  assert.equal(result.isValid, false);
  assert.match(result.errors[0], /لا يجوز السماح بالترحيل المباشر/);
});

test('Journal entry validation requires balance and valid active accounts', () => {
  const accounts = [
    { AccountId: 1, AccountNameAr: 'الصندوق', IsActive: true, IsPostingAllowed: true },
    { AccountId: 2, AccountNameAr: 'المبيعات', IsActive: true, IsPostingAllowed: true },
    { AccountId: 3, AccountNameAr: 'الأصول (رئيسي)', IsActive: true, IsPostingAllowed: false }
  ];

  // Unbalanced entry
  const unbalanced = validateJournalEntry(
    { EntryNumber: 'JV-01', EntryDate: '2026-01-01', Status: 'Draft' },
    [
      { AccountId: 1, DebitAmount: 1000, CreditAmount: 0 },
      { AccountId: 2, DebitAmount: 0, CreditAmount: 900 }
    ],
    accounts
  );
  assert.equal(unbalanced.isValid, false);
  assert.match(unbalanced.errors[0], /القيد غير متوازن/);

  // Posting to parent account
  const invalidAccount = validateJournalEntry(
    { EntryNumber: 'JV-02', EntryDate: '2026-01-01', Status: 'Draft' },
    [
      { AccountId: 3, DebitAmount: 1000, CreditAmount: 0 },
      { AccountId: 2, DebitAmount: 0, CreditAmount: 1000 }
    ],
    accounts
  );
  assert.equal(invalidAccount.isValid, false);
  assert.match(invalidAccount.errors[0], /حساب تجميعي رئيسي ولا يقبل الترحيل/);

  // Perfectly balanced
  const balanced = validateJournalEntry(
    { EntryNumber: 'JV-03', EntryDate: '2026-01-01', Status: 'Draft' },
    [
      { AccountId: 1, DebitAmount: 500, CreditAmount: 0 },
      { AccountId: 2, DebitAmount: 0, CreditAmount: 500 }
    ],
    accounts
  );
  assert.equal(balanced.isValid, true);
});
