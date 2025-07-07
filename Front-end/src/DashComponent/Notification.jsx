import React, { useState, useRef, useEffect } from 'react';
import { IoMdNotificationsOutline } from "react-icons/io";

export default function Notification({ notifications, clearNotifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="cursor-pointer relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IoMdNotificationsOutline className="text-2xl text-gray-700" />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-md z-10">
          <div className="flex justify-between p-2 ">
            <span className="font-semibold">Notifications</span>
            <button onClick={clearNotifications} className="text-xs text-blue-500 cursor-pointer hover:text-[#2c2c2c] duration-300">Clear all</button>
          </div>
          <ul className="max-h-48 overflow-y-auto p-1">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li key={n.id} className="p-2 text-sm text-[#363535] border-1 border-[#f1eeee] mb-2 rounded-lg">{n.msg}</li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">No new notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
