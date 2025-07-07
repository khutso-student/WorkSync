const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error('Login Error:', err.message); 
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};
