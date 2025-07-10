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
      const res = await API.put('/settings/user/change-password', formData, {
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
    <section className=" p-1   w-1/2 mx-auto ">
        <div className='bg-white rounded-xl  p-4 '>
              <h2 className="text-md font-semibold text-gray-900 mb-6  pb-2">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">Current Password</span>
            <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-1 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            </label>

            <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">New Password</span>
            <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-1 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            </label>

            <button
            type="submit"
            disabled={loading}
            className=" bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm rounded-md font-semibold transition"
            >
            {loading ? 'Changing...' : 'Change Password'}
            </button>
        </form>
        </div>
    
    </section>
  );
}
