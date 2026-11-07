import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ChartOfAccountsView } from './components/accounts/ChartOfAccountsView';
import { ErdDiagramView } from './components/erd/ErdDiagramView';
import { TablesListView } from './components/tables/TablesListView';
import { TableDetailsView } from './components/tables/TableDetailsView';
import { RelationshipsView } from './components/relationships/RelationshipsView';
import { DataManagerView } from './components/data/DataManagerView';
import { SettingsView } from './components/settings/SettingsView';
import { ModalsContainer } from './components/modals/ModalsContainer';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="flex h-screen bg-[#070B14] text-slate-100 overflow-hidden font-sans">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-[#070B14] relative">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'chart-of-accounts' && <ChartOfAccountsView />}
          {currentView === 'erd-diagram' && <ErdDiagramView />}
          {currentView === 'tables' && <TablesListView />}
          {currentView === 'table-details' && <TableDetailsView />}
          {currentView === 'relationships' && <RelationshipsView />}
          {currentView === 'data-manager' && <DataManagerView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Toast Notifications */}
      <ModalsContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
