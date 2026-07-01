import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../../services/api';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Inspector');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ username: newUsername, passwordHash: newPassword, role: newRole });
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (error) {
      alert('Failed to create user. Username might already exist.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium mb-4">Create New User</h3>
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input 
              required
              type="text" 
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input 
              required
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select 
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="Inspector">Inspector</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.username !== 'admin' && (
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
