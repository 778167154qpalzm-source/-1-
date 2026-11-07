import { ValidationResult } from '../types';

/**
 * Checks for circular references in a hierarchical parent-child structure.
 * Returns true if setting candidateParentId as parent for currentId would create a cycle.
 */
export function hasHierarchicalCycle(
  currentId: number,
  candidateParentId: number | null | undefined,
  allNodes: { id: number; parentId: number | null | undefined }[]
): boolean {
  if (!candidateParentId) return false;
  if (currentId === candidateParentId) return true;

  const nodeMap = new Map<number, number | null | undefined>();
  allNodes.forEach(node => nodeMap.set(node.id, node.parentId));

  let cursor: number | null | undefined = candidateParentId;
  const visited = new Set<number>();

  while (cursor !== null && cursor !== undefined) {
    if (cursor === currentId) {
      return true; // Cycle detected!
    }
    if (visited.has(cursor)) {
      return true; // Infinite loop in existing data!
    }
    visited.add(cursor);
    cursor = nodeMap.get(cursor);
  }

  return false;
}

/**
 * Validates a ChartOfAccounts account before insert or update.
 */
export function validateChartOfAccount(
  account: {
    AccountId?: number;
    CompanyId: number;
    AccountCode: string;
    AccountNameAr: string;
    AccountNameEn: string;
    ParentAccountId?: number | null;
    AccountTypeId: number;
    AccountNatureId: number;
    AccountLevelId: number;
    IsParent?: boolean;
    IsPostingAllowed?: boolean;
    IsActive?: boolean;
  },
  existingAccounts: any[]
): ValidationResult {
  const errors: string[] = [];

  if (!account.AccountCode || !account.AccountCode.trim()) {
    errors.push('رقم الحساب المحاسبي (AccountCode) مطلوب ولا يمكن تركه فارغاً.');
  }

  if (!account.AccountNameAr || !account.AccountNameAr.trim()) {
    errors.push('اسم الحساب بالعربية (AccountNameAr) إلزامي.');
  }

  if (!account.CompanyId) {
    errors.push('يجب تحديد الشركة التابع لها الحساب (CompanyId).');
  }

  // Check unique code within the same company
  const duplicateCode = existingAccounts.find(
    a => a.CompanyId === account.CompanyId &&
         a.AccountCode === account.AccountCode.trim() &&
         a.AccountId !== account.AccountId
  );
  if (duplicateCode) {
    errors.push(`رقم الحساب "${account.AccountCode}" مستخدم بالفعل في هذه الشركة. يجب أن يكون فريداً.`);
  }

  // Self parent check
  if (account.AccountId && account.ParentAccountId && account.AccountId === account.ParentAccountId) {
    errors.push('لا يجوز أن يكون الحساب أباً لنفسه.');
  }

  // Hierarchy cycle check
  if (account.AccountId && account.ParentAccountId) {
    const nodes = existingAccounts.map(a => ({ id: a.AccountId, parentId: a.ParentAccountId }));
    if (hasHierarchicalCycle(account.AccountId, account.ParentAccountId, nodes)) {
      errors.push('لا يمكن اختيار هذا الحساب الأب؛ سيؤدي ذلك إلى تشكيل حلقة هرمية مغلقة (Cycle).');
    }
  }

  // Parent account rule: if IsParent is true, IsPostingAllowed must be false
  if (account.IsParent && account.IsPostingAllowed) {
    errors.push('الحسابات الرئيسية التجميعية (IsParent=true) لا يجوز السماح بالترحيل المباشر إليها (IsPostingAllowed must be false).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates if an account can be safely deleted.
 */
export function canDeleteAccount(
  accountId: number,
  allAccounts: any[],
  allJournalLines: any[],
  allBalances: any[]
): ValidationResult {
  const errors: string[] = [];

  // Check if account has child accounts
  const childAccounts = allAccounts.filter(a => a.ParentAccountId === accountId);
  if (childAccounts.length > 0) {
    errors.push(`لا يمكن حذف الحساب لوجود (${childAccounts.length}) حسابات فرعية متفرعة منه. يجب نقلها أو حذفها أولاً.`);
  }

  // Check journal lines
  const lines = allJournalLines.filter(l => l.AccountId === accountId);
  if (lines.length > 0) {
    errors.push(`لا يمكن حذف الحساب لأنه مستخدم في (${lines.length}) أسطر قيود محاسبية.`);
  }

  // Check balances
  const balances = allBalances.filter(b => b.AccountId === accountId && (Number(b.ClosingDebit) > 0 || Number(b.ClosingCredit) > 0));
  if (balances.length > 0) {
    errors.push('لا يمكن حذف الحساب لوجود أرصدة محاسبية غير صفرية مرتبطة به.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a Journal Entry header and its lines for balanced debit/credit.
 */
export function validateJournalEntry(
  entry: {
    EntryNumber: string;
    EntryDate: string;
    Status: string;
  },
  lines: {
    AccountId: number;
    DebitAmount: number | string;
    CreditAmount: number | string;
  }[],
  allAccounts: any[]
): ValidationResult {
  const errors: string[] = [];

  if (!entry.EntryNumber || !entry.EntryNumber.trim()) {
    errors.push('رقم القيد مطلوب.');
  }

  if (!entry.EntryDate) {
    errors.push('تاريخ القيد مطلوب.');
  }

  if (!lines || lines.length < 2) {
    errors.push('يجب أن يحتوي القيد المحاسبي المكتمل على سطرين على الأقل.');
  }

  let totalDebit = 0;
  let totalCredit = 0;

  lines.forEach((line, index) => {
    const dr = Number(line.DebitAmount) || 0;
    const cr = Number(line.CreditAmount) || 0;

    if (dr > 0 && cr > 0) {
      errors.push(`السطر رقم ${index + 1}: لا يجوز أن يحتوي السطر على مبلغ مدين ومبلغ دائن في نفس الوقت.`);
    }

    if (dr <= 0 && cr <= 0) {
      errors.push(`السطر رقم ${index + 1}: يجب تحديد مبلغ مدين أو دائن أكبر من الصفر.`);
    }

    totalDebit += dr;
    totalCredit += cr;

    // Check account validity
    const account = allAccounts.find(a => a.AccountId === line.AccountId);
    if (!account) {
      errors.push(`السطر رقم ${index + 1}: الحساب المحدد غير موجود في شجرة الحسابات.`);
    } else {
      if (!account.IsActive) {
        errors.push(`السطر رقم ${index + 1}: الحساب "${account.AccountNameAr}" معطل وغير نشط.`);
      }
      if (!account.IsPostingAllowed) {
        errors.push(`السطر رقم ${index + 1}: الحساب "${account.AccountNameAr}" حساب تجميعي رئيسي ولا يقبل الترحيل.`);
      }
    }
  });

  // Balance check (diff tolerance 0.001)
  const diff = Math.abs(totalDebit - totalCredit);
  if (diff > 0.001) {
    errors.push(`القيد غير متوازن! إجمالي المدين (${totalDebit.toFixed(2)}) لا يتطابق مع إجمالي الدائن (${totalCredit.toFixed(2)}). فارق التوازن: ${diff.toFixed(2)}.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
