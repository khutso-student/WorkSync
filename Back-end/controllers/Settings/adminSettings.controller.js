const Role = require('../../models/Role');

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;
    if (!name) return res.status(400).json({ message: 'Role name is required' });

    // Check duplicate
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Role already exists' });

    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json({ message: 'Role created', role });
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ message: 'Failed to create role' });
  }
};

// Update role by id
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    if (!name) return res.status(400).json({ message: 'Role name is required' });

    const updated = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Role not found' });

    res.json({ message: 'Role updated', role: updated });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

// Delete role by id
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Role not found' });

    res.json({ message: 'Role deleted' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ message: 'Failed to delete role' });
  }
};
