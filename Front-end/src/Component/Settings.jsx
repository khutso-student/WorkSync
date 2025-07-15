// src/pages/Settings.jsx or wherever you route it
import ProfilePicture from '../Component/Settings/ProfilePicture';
import AdminRoles from '../Component/Settings/AdminRoles'
import ChangePassword from '../Component/Settings/ChangePassword'

// Inside your JSX


export default function Settings() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Profile Picture Section */}
      <ProfilePicture />
      <AdminRoles />
        <ChangePassword />
    </div>
  );
}
