const DefaultStatus = require('../../models/DefaultStatus');

// Get all default statuses
exports.getDefaultStatuses = async (req, res) => {
  try {
    const statuses = await DefaultStatus.find();
    res.json(statuses);
  } catch (err) {
    console.error('Error fetching default statuses:', err);
    res.status(500).json({ message: 'Failed to fetch default statuses' });
  }
};

// Create new default status entry
exports.createDefaultStatus = async (req, res) => {
  try {
    const { type, statuses } = req.body;
    if (!type || !Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({ message: 'Type and statuses array are required' });
    }

    const existing = await DefaultStatus.findOne({ type });
    if (existing) return res.status(400).json({ message: `Default status for type '${type}' already exists` });

    const newStatus = new DefaultStatus({ type, statuses });
    await newStatus.save();
    res.status(201).json({ message: 'Default status created', defaultStatus: newStatus });
  } catch (err) {
    console.error('Error creating default status:', err);
    res.status(500).json({ message: 'Failed to create default status' });
  }
};

// Update default status by id
exports.updateDefaultStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, statuses } = req.body;
    if (!type || !Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({ message: 'Type and statuses array are required' });
    }

    const updated = await DefaultStatus.findByIdAndUpdate(id, { type, statuses }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Default status not found' });

    res.json({ message: 'Default status updated', defaultStatus: updated });
  } catch (err) {
    console.error('Error updating default status:', err);
    res.status(500).json({ message: 'Failed to update default status' });
  }
};

// Delete default status by id
exports.deleteDefaultStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DefaultStatus.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Default status not found' });

    res.json({ message: 'Default status deleted' });
  } catch (err) {
    console.error('Error deleting default status:', err);
    res.status(500).json({ message: 'Failed to delete default status' });
  }
};
