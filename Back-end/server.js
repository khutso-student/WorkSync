const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AuthRoutes = require('./routes/AuthRoutes');
const EmployeeRoutes = require('./routes/EmployeeRoutes');
const projectRoutes = require('./routes/ProjectRoutes'); // lowercase p

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', AuthRoutes);
app.use('/api/employees', EmployeeRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
