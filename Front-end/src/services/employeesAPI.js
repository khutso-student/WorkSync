// employeesAPI.js
import api from './api'; // your axios instance


export const getEmployees = async (search = '') => {
  try {
      const response = await api.get(`/employees?search=${encodeURIComponent(search)}`);
      return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }

};


export const createEmployee = async (employeeData) => {
  const res = await api.post('/employees', employeeData);
  return res.data;
};

export const updateEmployee = async (id, updatedData) => {
  const res = await api.put(`/employees/${id}`, updatedData);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};
