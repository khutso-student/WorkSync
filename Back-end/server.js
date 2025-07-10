const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // ✅ Add this
const connectDB = require('./config/db');

const AuthRoutes = require('./routes/AuthRoutes');
const EmployeeRoutes = require('./routes/EmployeeRoutes');
const ProjectRoutes = require('./routes/ProjectRoutes');
const ChatRoutes = require('./routes/chatRoutes');

const adminSettingsRoutes = require('./routes/Settings/adminSettings.routes');
const defaultStatusRoutes = require('./routes/Settings/defaultStatus.routes');
const userLogsRoutes = require('./routes/Settings/userLogs.routes');
const userSettingsRoutes = require('./routes/Settings/userSettings.routes');


const { Server } = require('socket.io'); // ✅ correct import
const setupSocket = require('./socket/chatSocket') // ✅ your custom socket logic

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // ✅ wrap express app in http server

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

setupSocket(io); // ✅ use external socket logic

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/employees', EmployeeRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/chat', ChatRoutes);

app.use('/api/settings/roles', adminSettingsRoutes);
app.use('/api/settings/default-status', defaultStatusRoutes);
app.use('/api/settings/user-logs', userLogsRoutes);
app.use('/api/settings/user', userSettingsRoutes); // optional, could be /user-settings too


app.get('/api/ping', (req, res) => res.json({ message: 'Server is alive!' }));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
