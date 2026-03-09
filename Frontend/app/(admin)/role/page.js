"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/authService";
import Header from "@components/user/layout/Header";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const payload = response.data;
        const usersArray = Array.isArray(payload)
          ? payload
          : payload.data || payload.users || [];

        if (!Array.isArray(usersArray)) {
          throw new Error("Unexpected response format");
        }

        setUsers(usersArray);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, userUuid, newRole) => {
    const user = users.find(u => (u.id ?? u._id) === userId);
    if (!user || user.role === newRole) return;

    if (!confirm(`Change ${user.name}'s role from "${user.role}" to "${newRole}"?`)) return;

    setUpdatingUserId(userId);
    setSuccessMsg("");
    setError(null);

    try {
      await api.patch(`/users/${userUuid}/role`, { userId: userUuid, role: newRole });
      setUsers(prev => prev.map(u =>
        (u.id ?? u._id) === userId ? { ...u, role: newRole } : u
      ));
      setSuccessMsg(`${user.name}'s role updated to ${newRole}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(`Failed to update role: ${msg}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className='w-full flex flex-col justify-center items-center shadow-2xl sticky top-0 z-10 bg-white'>
        <div className='w-10/12'>
          <Header />
        </div>
      </div>
      <main className="w-10/12 mx-auto py-8 mt-8">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>

        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm">
            {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm">
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full border border-gray-300 text-left mb-4">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-2 border border-gray-300">Name</th>
                <th className="p-2 border border-gray-300">Email</th>
                <th className="p-2 border border-gray-300">Role</th>
                <th className="p-2 border border-gray-300">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id ?? user._id ?? index} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                  <td className="p-2 border border-gray-300">{user.name}</td>
                  <td className="p-2 border border-gray-300">{user.email}</td>
                  <td className="p-2 border border-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Owner' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id ?? user._id, user.uuid, e.target.value)}
                      disabled={updatingUserId === (user.id ?? user._id)}
                      className="border rounded p-1 disabled:opacity-50"
                    >
                      <option value="User">User</option>
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                    </select>
                    {updatingUserId === (user.id ?? user._id) && (
                      <span className="ml-2 text-xs text-gray-500">Updating...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
