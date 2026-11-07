export type DataType = 
  | 'INT'
  | 'BIGINT'
  | 'VARCHAR(50)'
  | 'VARCHAR(100)'
  | 'VARCHAR(255)'
  | 'DECIMAL(18,2)'
  | 'DECIMAL(18,4)'
  | 'BOOLEAN'
  | 'DATETIME'
  | 'DATE'
  | 'TEXT';

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export type TableGroupId = 
  | 'company_accounts'
  | 'fiscal_currencies'
  | 'cost_centers'
  | 'journal_entries'
  | 'balances'
  | 'users_audit';

export interface ColumnSchema {
  name: string;
  type: DataType;
  isPrimary?: boolean;
  isForeign?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  defaultValue?: string | number | boolean | null;
  foreignRef?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
    onUpdate?: 'CASCADE' | 'RESTRICT';
  };
  descriptionAr: string;
  descriptionEn: string;
  constraints?: string[];
}

export interface TableSchema {
  name: string;
  nameAr: string;
  nameEn: string;
  groupId: TableGroupId;
  descriptionAr: string;
  descriptionEn: string;
  primaryKey: string;
  columns: ColumnSchema[];
  defaultPosition?: { x: number; y: number };
}

export interface Relationship {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  type: RelationType;
  cardinality: '1:1' | '1:N' | 'N:M';
  labelAr: string;
  labelEn: string;
  isSelfReferential?: boolean;
}

export interface TableGroup {
  id: TableGroupId;
  nameAr: string;
  nameEn: string;
  color: string;
  headerColor: string;
  descriptionAr: string;
  descriptionEn: string;
}

export type AppView = 
  | 'dashboard'
  | 'chart-of-accounts'
  | 'erd-diagram'
  | 'tables'
  | 'table-details'
  | 'relationships'
  | 'data-manager'
  | 'settings';

export type Language = 'ar' | 'en';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
