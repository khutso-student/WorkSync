const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');

const connectDB = require('./config/db');

const AuthRoutes = require('./routes/AuthRoutes');
const EmployeeRoutes = require('./routes/EmployeeRoutes');
const ProjectRoutes = require('./routes/ProjectRoutes');
const ChatRoutes = require('./routes/chatRoutes');

const adminSettingsRoutes = require('./routes/Settings/adminSettings.routes');
const defaultStatusRoutes = require('./routes/Settings/defaultStatus.routes');
const userLogsRoutes = require('./routes/Settings/userLogs.routes');
const userSettingsRoutes = require('./routes/Settings/userSettings.routes');

const { Server } = require('socket.io');
const setupSocket = require('./socket/chatSocket');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Add all allowed frontend URLs here
const allowedOrigins = [
  'http://localhost:5173',
  'https://worksync-dbgz.onrender.com',     // optional for previewing backend
  'https://work-sync-nine.vercel.app'       // ✅ your Vercel frontend
];

// ✅ CORS for socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
setupSocket(io);

// ✅ CORS middleware for API routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed from this origin'));
  },
  credentials: true
}));

app.use(express.json());

// ✅ Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/employees', EmployeeRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/chat', ChatRoutes);

app.use('/api/settings/roles', adminSettingsRoutes);
app.use('/api/settings/default-status', defaultStatusRoutes);
app.use('/api/settings/user-logs', userLogsRoutes);
app.use('/api/settings/user', userSettingsRoutes);

// ✅ Ping
app.get('/api/ping', (req, res) => res.json({ message: 'Server is alive!' }));

// ✅ 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
