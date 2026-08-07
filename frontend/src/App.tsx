import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AppLayout from './components/layouts/AppLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import AdminDomainPage from './pages/admin/AdminDomainPage';
import EmployeeWorkspacePage from './pages/employee/EmployeeWorkspacePage';
import HrWorkspacePage from './pages/hr/HrWorkspacePage';
import ClientWorkspacePage from './pages/client/ClientWorkspacePage';
import FinanceWorkspacePage from './pages/finance/FinanceWorkspacePage';
import WorkspacePage from './pages/WorkspacePage';
import SettingsPage from './pages/SettingsPage';
import EmployeeProfile from './components/employee-profile/EmployeeProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { useLanguage } from './lib/useLanguage';

function App() {
  useLanguage();
  return (
    <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
    <Route path="/admin" element={<AppLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="companies" element={<CompaniesPage />} />
      <Route path="hr" element={<HrWorkspacePage />} />
      <Route path="hr/:section" element={<HrWorkspacePage />} />
      <Route path="clients" element={<ClientWorkspacePage />} />
      <Route path="clients/:section" element={<ClientWorkspacePage />} />
      <Route path="employees" element={<EmployeeWorkspacePage />} />
      <Route path="employees/:section" element={<EmployeeWorkspacePage />} />
      <Route path="employee-profile/:id" element={<EmployeeProfile />} />
      <Route path="finance" element={<FinanceWorkspacePage />} />
      <Route path="finance/:section" element={<FinanceWorkspacePage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path=":domain" element={<AdminDomainPage />} />
      <Route path=":domain/:section" element={<AdminDomainPage />} />
    </Route>
  </Route>
  <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'HR', 'FINANCE', 'EMPLOYEE', 'INFRASTRUCTURE', 'CLIENT']} />}>
    <Route path="/workspace" element={<AppLayout />}>
      <Route index element={<WorkspacePage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="hr" element={<HrWorkspacePage />} />
      <Route path="hr/:section" element={<HrWorkspacePage />} />
      <Route path="employee-portal" element={<EmployeeWorkspacePage />} />
      <Route path="employee-portal/:section" element={<EmployeeWorkspacePage />} />
      <Route path="employee-profile/:id" element={<EmployeeProfile />} />
      <Route path="*" element={<WorkspacePage />} />
    </Route>
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
