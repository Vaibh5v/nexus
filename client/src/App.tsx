import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardView from './features/dashboard/DashboardView';
import CaseList from './features/cases/CaseList';
import CaseDetails from './features/cases/CaseDetails';
import DocumentList from './features/documents/DocumentList';
import AuditLogList from './features/audit/AuditLogList';
import ApprovalList from './features/approvals/ApprovalList';
import UserList from './features/users/UserList';
import SettingsView from './features/settings/SettingsView';

function AuthenticatedPortal() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveNav('case_details');
  };

  const handleNavigate = (nav: string, payload?: any) => {
    if (nav === 'case_details' && payload) {
      setSelectedCaseId(payload);
      setActiveNav('case_details');
    } else {
      setSelectedCaseId(null);
      setActiveNav(nav);
    }
  };

  return (
    <DashboardLayout activeNav={activeNav === 'case_details' ? 'cases' : activeNav} onNavigate={handleNavigate}>
      {activeNav === 'dashboard' && (
        <DashboardView
          onNavigateToCases={() => handleNavigate('cases')}
          onSelectCase={handleSelectCase}
        />
      )}

      {activeNav === 'cases' && (
        <CaseList onSelectCase={handleSelectCase} />
      )}

      {activeNav === 'case_details' && selectedCaseId && (
        <CaseDetails
          caseId={selectedCaseId}
          onBack={() => setActiveNav('cases')}
        />
      )}

      {activeNav === 'documents' && (
        <DocumentList />
      )}

      {activeNav === 'approvals' && (
        <ApprovalList />
      )}

      {activeNav === 'audit' && (
        <AuditLogList />
      )}

      {activeNav === 'users' && (
        <UserList />
      )}

      {activeNav === 'settings' && (
        <SettingsView />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AuthenticatedPortal />
      </ProtectedRoute>
    </AuthProvider>
  );
}
