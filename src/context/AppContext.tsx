import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppView, Language } from '../types';
import { TRANSLATIONS, getTranslation } from '../locales/translations';
import { initializeDatabase, subscribeToDatabase } from '../db/storage';

interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['ar']) => string;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedTable: string;
  setSelectedTable: (tableName: string) => void;
  tableSubView: 'structure' | 'data';
  setTableSubView: (view: 'structure' | 'data') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  notifications: NotificationState[];
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalPayload: any;
  setModalPayload: (payload: any) => void;
  dbVersion: number;
  refreshDb: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedTable, setSelectedTable] = useState<string>('ChartOfAccounts');
  const [tableSubView, setTableSubView] = useState<'structure' | 'data'>('structure');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalPayload, setModalPayload] = useState<any>(null);
  const [dbVersion, setDbVersion] = useState<number>(1);

  // Initialize database and subscribe to local changes
  useEffect(() => {
    initializeDatabase();
    const unsubscribe = subscribeToDatabase(() => {
      setDbVersion(v => v + 1);
    });
    return unsubscribe;
  }, []);

  // Update HTML document attributes when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS['ar']) => {
    return getTranslation(language, key);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const refreshDb = () => {
    setDbVersion(v => v + 1);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentView,
        setCurrentView,
        selectedTable,
        setSelectedTable,
        tableSubView,
        setTableSubView,
        searchTerm,
        setSearchTerm,
        notifications,
        showNotification,
        activeModal,
        setActiveModal,
        modalPayload,
        setModalPayload,
        dbVersion,
        refreshDb
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
