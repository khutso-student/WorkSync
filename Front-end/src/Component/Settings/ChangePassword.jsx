// src/components/settings/ChangePassword.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/axios';
import toast from 'react-hot-toast';

export default function ChangePassword() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/api/settings/user/change-password', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success(res.data.message || 'Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="inline-block px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </section>
  );
}
