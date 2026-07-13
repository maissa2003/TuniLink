import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AppLayout from './components/layouts/AppLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import CompaniesPage from './pages/admin/CompaniesPage';
import AdminDomainPage from './pages/admin/AdminDomainPage';
import EmployeeWorkspacePage from './pages/employee/EmployeeWorkspacePage';
import WorkspacePage from './pages/WorkspacePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useLanguage } from './lib/useLanguage';

function App() {
  useLanguage();
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="employees" element={<EmployeeWorkspacePage />} />
        <Route path="employees/:section" element={<EmployeeWorkspacePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path=":domain" element={<AdminDomainPage />} />
        <Route path=":domain/:section" element={<AdminDomainPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['HR', 'FINANCE', 'EMPLOYEE', 'INFRASTRUCTURE', 'CLIENT']} />}>
      <Route path="/workspace" element={<AppLayout />}>
        <Route index element={<WorkspacePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path=":section" element={<WorkspacePage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
export default App;
