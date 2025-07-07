const Projects = require('../models/Projects');

const getProjects = async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i'); // case-insensitive search

    const projects = await Projects.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};


const createProject = async (req, res) =>{
    try {
        const { title, description, status } = req.body;

        if(!title || !description || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newProject = new Projects({ title, description, status });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(400).json({ message: 'Failed to create project', error: error.message });
    }
};

const updateProject = async (req, res) => {
  try {
    const { role } = req.user; 
    const project = await Projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (role === 'employee') {
      // Employees can only update status
      if (!req.body.status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      project.status = req.body.status;
    } else if (role === 'admin') {
      // Admins can update everything
      const { title, description, status } = req.body;
      if (title) project.title = title;
      if (description) project.description = description;
      if (status) project.status = status;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({ message: 'Failed to update project' });
  }
};


const deleteProject = async (req, res) =>{
    try {
        const deleted = await Projects.findByIdAndDelete(req.params.id);
        if(!deleted) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ message: 'Failed to delete project' });
    }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };