import api from './api';

export const getProjects = async (search = '') => {
  try {
    const response = await api.get(`/projects?search=${search}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    throw error;
  }
};

export const createProject = async (projectData) => {
    const res = await api.post('/projects', projectData);
    return res.data;
};

export const updateProject = async (id, updateData) => {
    const res = await api.put(`/projects/${id}`, updateData);
    return res.data;
};

export const deleteProject = async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
};
