import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLayout() {
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400">Welcome, {username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/products" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition">
            Product Management
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition">
            User Management
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
