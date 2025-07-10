// src/api/projectAPI.js
import api from '../services/api'; // ✅ this is your axios instance with token

export async function getProjects(search = '') {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/projects${query}`);
    return response.data;
  } catch (error) {
    console.error('getProjects error:', error);
    throw error;
  }
}

export async function getCompletedProjects() {
  try {
    const response = await api.get('/projects/completed');
    return response.data;
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    throw error;
  }
}

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
