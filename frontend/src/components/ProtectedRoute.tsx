import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role ?? '')) return <Navigate to="/" replace />;

  return <Outlet />;
}