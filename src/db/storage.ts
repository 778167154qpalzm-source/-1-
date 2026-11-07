import { SCHEMAS } from './schema';
import { INITIAL_DATABASE_DATA } from './seed';
import { RELATIONSHIPS } from './relationships';

const STORAGE_PREFIX = 'accounting_db_';
const DATA_KEY = `${STORAGE_PREFIX}data`;
const ERD_KEY = `${STORAGE_PREFIX}erd_positions`;
const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;

export interface StorageData {
  tables: Record<string, Record<string, any>[]>;
  lastUpdated: string;
}

export interface ErdNodePosition {
  x: number;
  y: number;
}

// In-memory event listeners for reactivity across components
type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export function subscribeToDatabase(listener: StorageListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Error in storage subscriber:', e);
    }
  });
}

/**
 * Initialize database with seed data if not present.
 */
export function initializeDatabase(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(DATA_KEY);
  if (!existing) {
    resetDatabase();
  }
}

/**
 * Reset database to pristine initial seed data.
 */
export function resetDatabase(): void {
  if (typeof window === 'undefined') return;
  const initialData: StorageData = {
    tables: JSON.parse(JSON.stringify(INITIAL_DATABASE_DATA)),
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
  
  // Also reset default ERD positions if missing
  const defaultPositions: Record<string, ErdNodePosition> = {};
  SCHEMAS.forEach(s => {
    defaultPositions[s.name] = s.defaultPosition || { x: 50, y: 50 };
  });
  localStorage.setItem(ERD_KEY, JSON.stringify(defaultPositions));
  notifySubscribers();
}

/**
 * Retrieve all records for a specific table.
 */
export function getTableData(tableName: string): Record<string, any>[] {
  if (typeof window === 'undefined') return INITIAL_DATABASE_DATA[tableName] || [];
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return INITIAL_DATABASE_DATA[tableName] || [];
    const parsed: StorageData = JSON.parse(raw);
    return parsed.tables[tableName] || [];
  } catch (e) {
    console.error('Failed to parse database storage:', e);
    return INITIAL_DATABASE_DATA[tableName] || [];
  }
}

/**
 * Get all tables in a single dictionary.
 */
export function getAllTablesData(): Record<string, Record<string, any>[]> {
  if (typeof window === 'undefined') return INITIAL_DATABASE_DATA;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return INITIAL_DATABASE_DATA;
    const parsed: StorageData = JSON.parse(raw);
    return parsed.tables || INITIAL_DATABASE_DATA;
  } catch (e) {
    return INITIAL_DATABASE_DATA;
  }
}

/**
 * Add a record to a table.
 */
export function addRecord(tableName: string, record: Record<string, any>): Record<string, any> {
  const schema = SCHEMAS.find(s => s.name === tableName);
  if (!schema) throw new Error(`Table ${tableName} not found in schema`);

  const raw = localStorage.getItem(DATA_KEY);
  const data: StorageData = raw ? JSON.parse(raw) : { tables: {}, lastUpdated: '' };
  if (!data.tables[tableName]) {
    data.tables[tableName] = [];
  }

  // Auto-generate primary key if not provided or 0
  const pk = schema.primaryKey;
  if (!record[pk]) {
    const maxId = data.tables[tableName].reduce((max, row) => Math.max(max, Number(row[pk]) || 0), 0);
    record[pk] = maxId + 1;
  }

  // Defaults
  schema.columns.forEach(col => {
    if (record[col.name] === undefined && col.defaultValue !== undefined) {
      if (col.defaultValue === 'CURRENT_TIMESTAMP') {
        record[col.name] = new Date().toISOString().replace('T', ' ').substring(0, 19);
      } else {
        record[col.name] = col.defaultValue;
      }
    }
  });

  data.tables[tableName].push(record);
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(DATA_KEY, JSON.stringify(data));

  // Auto-log audit for non-audit log insertions
  if (tableName !== 'AuditLogs') {
    createAuditLog({
      UserId: 1,
      CompanyId: record.CompanyId || 1,
      TableName: tableName,
      RecordId: String(record[pk]),
      ActionType: 'INSERT',
      OldValue: null,
      NewValue: JSON.stringify(record),
      Notes: `إضافة سجل جديد في جدول ${schema.nameAr}`
    });
  }

  notifySubscribers();
  return record;
}

/**
 * Update an existing record in a table.
 */
export function updateRecord(tableName: string, id: any, updatedFields: Record<string, any>): boolean {
  const schema = SCHEMAS.find(s => s.name === tableName);
  if (!schema) return false;

  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return false;
  const data: StorageData = JSON.parse(raw);
  const rows = data.tables[tableName];
  if (!rows) return false;

  const pk = schema.primaryKey;
  const index = rows.findIndex(r => String(r[pk]) === String(id));
  if (index === -1) return false;

  const oldRecord = { ...rows[index] };
  const newRecord = { ...rows[index], ...updatedFields };

  // Update UpdatedAt if present in schema
  if (schema.columns.some(c => c.name === 'UpdatedAt')) {
    newRecord.UpdatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  rows[index] = newRecord;
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(DATA_KEY, JSON.stringify(data));

  if (tableName !== 'AuditLogs') {
    createAuditLog({
      UserId: 1,
      CompanyId: newRecord.CompanyId || 1,
      TableName: tableName,
      RecordId: String(id),
      ActionType: 'UPDATE',
      OldValue: JSON.stringify(oldRecord),
      NewValue: JSON.stringify(newRecord),
      Notes: `تعديل السجل ${id} في جدول ${schema.nameAr}`
    });
  }

  notifySubscribers();
  return true;
}

/**
 * Delete a record from a table.
 */
export function deleteRecord(tableName: string, id: any): boolean {
  const schema = SCHEMAS.find(s => s.name === tableName);
  if (!schema) return false;

  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return false;
  const data: StorageData = JSON.parse(raw);
  const rows = data.tables[tableName];
  if (!rows) return false;

  const pk = schema.primaryKey;
  const index = rows.findIndex(r => String(r[pk]) === String(id));
  if (index === -1) return false;

  const removed = rows[index];
  rows.splice(index, 1);
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(DATA_KEY, JSON.stringify(data));

  if (tableName !== 'AuditLogs') {
    createAuditLog({
      UserId: 1,
      CompanyId: removed.CompanyId || 1,
      TableName: tableName,
      RecordId: String(id),
      ActionType: 'DELETE',
      OldValue: JSON.stringify(removed),
      NewValue: null,
      Notes: `حذف السجل ${id} من جدول ${schema.nameAr}`
    });
  }

  notifySubscribers();
  return true;
}

/**
 * Creates an entry in AuditLogs table.
 */
function createAuditLog(log: {
  UserId: number;
  CompanyId: number | null;
  TableName: string;
  RecordId: string;
  ActionType: string;
  OldValue: string | null;
  NewValue: string | null;
  Notes: string;
}) {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return;
    const data: StorageData = JSON.parse(raw);
    if (!data.tables['AuditLogs']) {
      data.tables['AuditLogs'] = [];
    }
    const maxId = data.tables['AuditLogs'].reduce((max, r) => Math.max(max, Number(r.AuditLogId) || 0), 0);
    const newLog = {
      AuditLogId: maxId + 1,
      ...log,
      ActionDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    data.tables['AuditLogs'].unshift(newLog); // Prepend to top
    // Limit to 100 most recent logs in localStorage
    if (data.tables['AuditLogs'].length > 100) {
      data.tables['AuditLogs'] = data.tables['AuditLogs'].slice(0, 100);
    }
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Audit log creation failed:', e);
  }
}

/**
 * ERD positions storage
 */
export function getErdPositions(): Record<string, ErdNodePosition> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ERD_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  const defaultPos: Record<string, ErdNodePosition> = {};
  SCHEMAS.forEach(s => {
    defaultPos[s.name] = s.defaultPosition || { x: 50, y: 50 };
  });
  return defaultPos;
}

export function saveErdPositions(positions: Record<string, ErdNodePosition>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ERD_KEY, JSON.stringify(positions));
}

/**
 * Export full project data as JSON string.
 */
export function exportProjectData(): string {
  const data = getAllTablesData();
  const positions = getErdPositions();
  const payload = {
    metadata: {
      appName: 'Accounting Database & Chart of Accounts Designer',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      tablesCount: Object.keys(data).length,
      relationshipsCount: RELATIONSHIPS.length
    },
    schemas: SCHEMAS,
    relationships: RELATIONSHIPS,
    erdPositions: positions,
    data
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Import project data from JSON string with validation.
 */
export function importProjectData(jsonStr: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.data || typeof parsed.data !== 'object') {
      return { success: false, message: 'ملف JSON غير صالح: لا يحتوي على حقل البيانات "data" الرئيسي.' };
    }

    const validTables = SCHEMAS.map(s => s.name);
    const importedKeys = Object.keys(parsed.data);
    const hasAnyValidTable = importedKeys.some(k => validTables.includes(k));

    if (!hasAnyValidTable) {
      return { success: false, message: 'الملف لا يحتوي على جداول محاسبية متوافقة مع هذا النظام.' };
    }

    const storageData: StorageData = {
      tables: parsed.data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(DATA_KEY, JSON.stringify(storageData));

    if (parsed.erdPositions && typeof parsed.erdPositions === 'object') {
      localStorage.setItem(ERD_KEY, JSON.stringify(parsed.erdPositions));
    }

    notifySubscribers();
    return { success: true, message: `تم استيراد البيانات بنجاح (${importedKeys.length} جدول).` };
  } catch (e: any) {
    return { success: false, message: `خطأ أثناء قراءة الملف: ${e.message || 'JSON تالف'}` };
  }
}

/**
 * Generate standard SQL DDL schema script for the database.
 */
export function generateSqlDdl(): string {
  let sql = `-- =========================================================================\n`;
  sql += `-- Accounting Database & Chart of Accounts Schema DDL\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Tables: ${SCHEMAS.length} | Relationships: ${RELATIONSHIPS.length}\n`;
  sql += `-- =========================================================================\n\n`;

  SCHEMAS.forEach(schema => {
    sql += `-- -------------------------------------------------------------------------\n`;
    sql += `-- Table: ${schema.name} (${schema.nameAr} - ${schema.nameEn})\n`;
    sql += `-- Description: ${schema.descriptionAr}\n`;
    sql += `-- -------------------------------------------------------------------------\n`;
    sql += `CREATE TABLE ${schema.name} (\n`;

    const colDefs = schema.columns.map(col => {
      let def = `  ${col.name.padEnd(25)} ${col.type}`;
      if (col.isPrimary) def += ' PRIMARY KEY';
      if (!col.isNullable) def += ' NOT NULL';
      if (col.isUnique && !col.isPrimary) def += ' UNIQUE';
      if (col.defaultValue !== undefined) {
        if (typeof col.defaultValue === 'string' && col.defaultValue !== 'CURRENT_TIMESTAMP') {
          def += ` DEFAULT '${col.defaultValue}'`;
        } else {
          def += ` DEFAULT ${col.defaultValue}`;
        }
      }
      return def;
    });

    // Add Foreign Key constraints
    schema.columns.forEach(col => {
      if (col.foreignRef) {
        let fk = `  CONSTRAINT FK_${schema.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${col.foreignRef.table}(${col.foreignRef.column})`;
        if (col.foreignRef.onDelete) fk += ` ON DELETE ${col.foreignRef.onDelete}`;
        if (col.foreignRef.onUpdate) fk += ` ON UPDATE ${col.foreignRef.onUpdate}`;
        colDefs.push(fk);
      }
    });

    sql += colDefs.join(',\n');
    sql += `\n);\n\n`;
  });

  return sql;
}
