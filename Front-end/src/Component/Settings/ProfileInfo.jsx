// src/components/settings/ProfileInfo.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/axios';
import toast from 'react-hot-toast';

export default function ProfileInfo() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = user.token;
      const res = await API.put('/settings/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated!');
      setUser(prev => ({ ...prev, ...res.data.user }));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-[#dbdada] rounded-xl p-4 w-full mx-auto">
     <p className='text-[#504e4e] mb-4'>Upload Your Profile</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 font-medium mb-1 block">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium mb-1 block">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium mb-1 block">Phone (optional)</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className=" bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md font-semibold transition"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
}
