import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  // Use localStorage fallback if no user prop passed
  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      // You can add more options here as needed
    });

    // Only emit 'userConnected' after socket connects to avoid race conditions
    socketInstance.on('connect', () => {
      socketInstance.emit('userConnected', currentUser);
    });

    socketInstance.on('chatHistory', (msgs) => {
      setMessages(msgs);
    });

    socketInstance.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketInstance.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on('typing', (name) => {
      setTypingUser(name);
    });

    socketInstance.on('stopTyping', () => {
      setTypingUser(null);
    });

    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.off('connect');
      socketInstance.off('chatHistory');
      socketInstance.off('chatMessage');
      socketInstance.off('onlineUsers');
      socketInstance.off('typing');
      socketInstance.off('stopTyping');
      socketInstance.disconnect();
    };
  }, [currentUser]);

  // Debounce typing events to reduce event spam (optional)
  let typingTimeout = null;

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
    if (socket && currentUser) {
      socket.emit('typing', currentUser.name);
      // Clear previous timeout and set new to stop typing after 2s inactivity
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        stopTyping();
      }, 2000);
    }
  };

  const stopTyping = () => {
    if (socket) socket.emit('stopTyping');
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
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
