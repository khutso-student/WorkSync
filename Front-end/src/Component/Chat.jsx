// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { IoSendSharp } from "react-icons/io5";

export default function Chat() {
  const { messages, onlineUsers, typingUser, sendMessage, startTyping, stopTyping } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value) startTyping();
    else stopTyping();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage('');
    stopTyping();
  };

  return (
    <div className="relative flex flex-col  h-screen w-full rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-[#f3f3f3] text-white border-b border-[#d4d4d4] p-4 flex justify-between items-center">
        <h2 className="font-bold text-lg text-[#474747]">WORKSYNC Team Chat</h2>
        <p className='text-[#5e5c5c] hidden sm:block'>Live Chat</p>
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded-full transition"
        >
          <HiOutlineUserGroup size={20} />
          <span className="text-sm font-medium cursor-pointer">{onlineUsers.length}</span>
        </button>
      </div>

      {/* Floating Online Users Panel */}
      {showUsers && (
        <div className="absolute right-4 top-20 z-30 w-64 bg-white border border-[#9b9898] shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Online Users</h3>
            <button onClick={() => setShowUsers(false)}><IoClose size={22} className='hover:text-blue-600 text-[#363636] cursor-pointer' /></button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {onlineUsers.length === 0 && (
              <p className="text-sm text-gray-500">No one online yet</p>
            )}
            {onlineUsers.map((user, i) => (
              <div
                key={i}
                className="flex justify-between  bg-blue-50 border border-blue-100 px-3 py-2 rounded text-sm text-blue-900 shadow-sm"
              >
                <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
                </div>
                    <span className='w-2 h-2 rounded-[100%] mt-1 bg-green-500'></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3">
        {messages.map((msg, i) => {
          const isOwn = msg.user === JSON.parse(localStorage.getItem("user"))?.name;
          return (
            <div
              key={i}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-md px-4 py-2 rounded-lg shadow text-sm ${
                isOwn ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border'
              }`}>
                <div className="font-semibold mb-1">
                  {isOwn ? 'You' : msg.user}
                </div>
                <div>{msg.message || msg.text}</div>
                <div className="text-[10px] text-gray-300 mt-1 text-right">
                  {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="px-4 py-1 text-sm italic text-gray-600 bg-gray-100">
          {typingUser} is typing...
        </div>
      )}

      {/* Input */}
      <div className='flex justify-center items-center w-full  mb-6 sm:mb-2'>
        <div className=' w-[90%] sm:w-[70%] py-2 px-4'>
         
              <form onSubmit={handleSubmit} className="p-2 w-full flex gap-2">
                  <div className='bg-[#e4e4e4] w-full rounded-lg'>
                      <input
                      type="text"
                      className="flex-1 px-4 py-2 focus:outline-none w-full"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={handleInputChange}
                      />
                  </div>
          
                  <button
                  type="submit"
                  className="bg-blue-600 text-white cursor-pointer px-3 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                      <IoSendSharp />
                  </button>
            </form>
        </div>
      </div>
                <footer className="w-full text-center py-4 text-gray-300 text-sm">
                  © {new Date().getFullYear()} Work-Sync
                </footer>
   
    </div>
  );
}
