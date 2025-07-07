const Employee = require('../models/Employees');

// Get all employees

const getEmployees = async (req, res) => {
  try {
    const search = req.query.search || '';
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};


// Create a new employee (Admin only)
const createEmployee = async (req, res) => {
  try {
    const { name, position, age, phone } = req.body;

    if (!name || !position || !age || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEmployee = new Employee({ name, position, age, phone });
    await newEmployee.save();

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error.message);
    res.status(400).json({ message: "Failed to create employee", error: error.message });
  }
};

// Update an employee (Admin only)
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating employee:", error.message);
    res.status(500).json({ message: "Failed to update employee" });
  }
};

// Delete an employee (Admin only)
const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: 'Employee deleted' });
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).json({ message: "Failed to delete employee" });
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };
