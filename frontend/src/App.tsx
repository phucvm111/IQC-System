import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inspection from './pages/Inspection';
import DefectReport from './pages/DefectReport';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import PrintProduct from './pages/PrintProduct';
import { useAuthStore } from './store/useAuthStore';

function PrivateRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: string }) {
  const { token, role } = useAuthStore();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'Admin' ? '/admin/products' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Inspector Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRole="Inspector"><Dashboard /></PrivateRoute>
          } />
          <Route path="/inspection" element={
            <PrivateRoute allowedRole="Inspector"><Inspection /></PrivateRoute>
          } />
          <Route path="/defect-report" element={
            <PrivateRoute allowedRole="Inspector"><DefectReport /></PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute allowedRole="Admin"><AdminLayout /></PrivateRoute>
          }>
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          
          {/* Print Route (Accessible by Admin) */}
          <Route path="/admin/products/:id/print" element={
            <PrivateRoute allowedRole="Admin"><PrintProduct /></PrivateRoute>
          } />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
