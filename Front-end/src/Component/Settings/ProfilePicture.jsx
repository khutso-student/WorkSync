// src/components/settings/ProfilePicture.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/axios';
import toast from 'react-hot-toast';
import { BiEditAlt } from "react-icons/bi";
import ProfileInfo from './ProfileInfo';
import ChangePassword from './ChangePassword';

export default function ProfilePicture() {
  const { user, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setLoading(true);
    try {
      const res = await API.put('/settings/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success('Profile picture updated!');
      setUser(prev => ({ ...prev, ...res.data.user }));
      setFile(null);
      setPreview('');
      setShowProfile(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6 mx-auto w-full max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left: Profile Info */}
        <div className="flex flex-col md:flex-row items-start gap-6 w-full md:w-1/2">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
            {preview || user?.profilePicture ? (
              <img
                src={preview || `http://localhost:5000/${user.profilePicture}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-700"><strong>Name:</strong> {user?.name}</p>
            <p className="text-sm text-gray-700"><strong>Email:</strong> {user?.email}</p>
            <p className="text-sm text-gray-700"><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-2"
            >
              <BiEditAlt /> {showProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Right: Change Password */}
        <div className="w-full md:w-1/2">
          <ChangePassword />
        </div>
      </div>

      {/* Modal: Upload Image & Edit Info */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center px-4">
          <div
            onClick={() => setShowProfile(false)}
            className="absolute inset-0"
          ></div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-50 w-full max-w-xl bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Profile Picture</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:border-none cursor-pointer"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border mx-auto"
                />
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfile(false)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>

            <hr className="my-6" />
            <ProfileInfo />
          </div>
        </div>
      )}
    </section>
  );
}
