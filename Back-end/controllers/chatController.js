import Message from '../models/Message.js';

// GET all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 }); // uses timestamps
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching messages' });
  }
};

// POST a new message
export const sendMessage = async (req, res) => {
  const { user, message, role } = req.body; // ✅ match field name from model

  try {
    const newMessage = new Message({ user, message, role });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: 'Failed to send message' });
  }
};
