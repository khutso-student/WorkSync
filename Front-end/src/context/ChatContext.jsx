import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  // Use localStorage fallback in case 'user' is not passed
  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    setSocket(socketInstance);

    // Emit user connection
    socketInstance.emit('userConnected', currentUser);

    // Chat history
    socketInstance.on('chatHistory', (msgs) => {
      setMessages(msgs);
    });

    // New message
    socketInstance.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Online users
    socketInstance.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Typing
    socketInstance.on('typing', (name) => {
      setTypingUser(name);
    });

    socketInstance.on('stopTyping', () => {
      setTypingUser(null);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.off('chatHistory');
      socketInstance.off('chatMessage');
      socketInstance.off('onlineUsers');
      socketInstance.off('typing');
      socketInstance.off('stopTyping');
      socketInstance.disconnect();
    };
  }, [currentUser]);

  const sendMessage = (message) => {
    if (socket && currentUser) {
      socket.emit('chatMessage', {
        user: currentUser.name,
        message,
        role: currentUser.role,
      });
    }
  };

  const startTyping = () => {
    if (socket && currentUser) socket.emit('typing', currentUser.name);
  };

  const stopTyping = () => {
    if (socket) socket.emit('stopTyping');
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        onlineUsers,
        typingUser,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
