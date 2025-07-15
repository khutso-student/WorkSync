import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Notification from './Notification';
import SearchInput from '../Component/SearchInput';

export default function DashTop({ searchTerm, setSearchTerm, notifications, clearNotifications }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex justify-between  p-2 items-center bg-[#c4c4c41e] w-full h-15 rounded-md">
    <p className="hidden md:block text-ms text-[#222222]">
        Welcome back,{' '}
        <span className="font-bold text-blue-500 capitalize">
          {user?.role || 'User'}
        </span>
    </p>


      <div className="w-full p-2 sm-w-[50%]">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
        />
      </div>

      <div className="flex justify-center items-center gap-2 p-2">
        <Notification notifications={notifications} clearNotifications={clearNotifications} />
        <div className="hidden sm:block bg-black p-4 rounded-full" />
        <p className="hidden md:block text-xs font-bold text-[#424242]">
          {user?.name || 'Guest'}
        </p>
      </div>
    </div>
  );
}
