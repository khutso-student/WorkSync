import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/axios';
import toast from 'react-hot-toast';
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function AdminRoles() {
  const { user } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: '', permissions: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const isAdmin = user?.role === 'admin';

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModel ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [showModel]);

  // Fetch roles only if user is admin
  const fetchRoles = async () => {
    if (!isAdmin) return;
    try {
      const res = await API.get('/api/settings/roles', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRoles(res.data);
    } catch (err) {
      toast.error('Failed to fetch roles');
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchRoles();
  }, [user, isAdmin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return toast.error('Only admins can perform this action');
    if (!form.name) return toast.error("Role name is required");

    const payload = {
      name: form.name,
      permissions: form.permissions.split(',').map(p => p.trim()),
    };

    try {
      setLoading(true);
      if (editId) {
        await API.put(`/api/settings/roles/${editId}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success('Role updated');
      } else {
        await API.post('/api/settings/roles', payload, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        toast.success('Role created');
      }
      setForm({ name: '', permissions: '' });
      setEditId(null);
      setShowModel(false); // Close modal on success
      fetchRoles();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error saving role');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    if (!isAdmin) return toast.error('Only admins can edit roles');
    setForm({
      name: role.name,
      permissions: role.permissions.join(', ')
    });
    setEditId(role._id);
    setShowModel(true); // Open modal
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return toast.error('Only admins can delete roles');
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      await API.delete(`/api/settings/roles/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Role deleted');
      fetchRoles();
    } catch (err) {
      toast.error('Error deleting role');
    }
  };

  if (!isAdmin) {
    return (
      <section className="p-6 text-center text-gray-400">
        You don’t have access to view this page.
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl border border-[#dad8d8] max-w-5xl mx-auto">
      <div className='flex justify-between items-center p-2 mb-4'>
        <h2 className="text-xl font-semibold text-[#272727]">Manage Roles</h2>
        <button
          onClick={() => {
            if (showModel) {
              setShowModel(false);
            } else {
              setEditId(null);
              setForm({ name: '', permissions: '' });
              setShowModel(true);
            }
          }}
          className='bg-blue-500 text-sm text-white py-1.5 px-4 rounded-md'
        >
          {showModel ? "Cancel" : "Add Role"}
        </button>
      </div>

      {/* MODAL */}
      {showModel && (
        <div
          onClick={() => setShowModel(false)}
          className='fixed top-0 left-0 w-full h-full bg-[#00000063] flex justify-center items-center z-50'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='flex flex-col justify-center items-center bg-white w-72 p-4 rounded-lg shadow-lg'
          >
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label className="block text-sm mb-1 text-[#3f3e3e] font-medium">Role Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-[#7c7a7a] px-3 py-1 rounded-md text-sm focus:outline-[#838383]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#3f3e3e] font-medium">Permissions (comma-separated)</label>
                <input
                  type="text"
                  name="permissions"
                  value={form.permissions}
                  onChange={handleChange}
                  className="w-full border border-[#7c7a7a] px-3 py-1 rounded-md text-sm focus:outline-[#838383]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  {editId ? 'Update Role' : 'Add Role'}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({ name: '', permissions: '' });
                    }}
                    className="px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="w-full text-sm border border-[#b8b4b4] rounded-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 text-[#2e2d2d]">Role</th>
            <th className="p-2 text-[#2e2d2d]">Permissions</th>
            <th className="p-2 text-[#2e2d2d]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">No roles found</td>
            </tr>
          ) : (
            roles.map(role => (
              <tr key={role._id} className="border-t border-[#a3a3a3]">
                <td className="p-2 text-[#1a1a1a] font-medium">{role.name}</td>
                <td className="p-2 text-gray-600">{role.permissions.join(', ') || '—'}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(role)} className="text-[17px] cursor-pointer">
                    <MdEditSquare className='text-blue-600 hover:text-blue-500' />
                  </button>
                  <button onClick={() => handleDelete(role._id)} className="text-[17px] cursor-pointer">
                    <RiDeleteBin5Fill className='text-red-500 hover:text-red-400' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
