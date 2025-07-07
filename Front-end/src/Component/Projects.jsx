import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projectAPI';
import toast from 'react-hot-toast';
import { IoIosAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function Projects({ setProjectCount }) {
  const { user } = useContext(AuthContext);
  const [showPop, setShowPop] = useState(false);
  const [error, setError] = useState('');
  const [load, setLoad] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not complete',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    await fetchProjects(searchTerm);
  }, 500);
  return () => clearTimeout(delayDebounce);
}, [searchTerm]);



  const fetchProjects = async (search = '') => {
  setLoad(true);
  try {
    const data = await getProjects(search); // <-- API call with search param
    setProjects(data);
    setProjectCount(data.length);
    setError(''); 
    return(data)
  } catch (error) {
    setError('Failed to fetch projects');
    return[];
  } finally {
    setLoad(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (user?.role !== 'admin') {
      return toast.error('Only admin can add projects');
    }
    try {
      await createProject(formData);
      const data = await getProjects();
      setProjects(data);
      setFormData({ title: '', description: '', status: 'Not complete' });
      setEditingId(null);
      setShowPop(false);
      setProjectCount(data.length);
      toast.success('Project added successfully!');
    } catch (error) {
      toast.error('Error adding project');
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setFormData({ ...project });
    setShowPop(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'Not complete' });
    setShowPop(false);
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  let updateData = formData;

  if (user?.role === 'employee') {
    updateData = { status: formData.status };
  }

  try {
    await updateProject(editingId, updateData);
    const updatedProjects = await fetchProjects();  // get fresh data
    setProjectCount(updatedProjects.length);         // update count using fresh data
    setEditingId(null);
    setFormData({ title: '', description: '', status: 'Not complete' });
    setShowPop(false);
    toast.success('Project updated successfully!');
  } catch (error) {
    toast.error('Error updating project');
  }
};


  const handleDelete = async (id) => {
    if (user?.role !== 'admin') {
      return toast.error('Only admin can delete projects');
    }
    if (!window.confirm('Delete this project?')) return;

    try {
      await deleteProject(id);
      const data = await getProjects();
      setProjects(data);
      setProjectCount(data.length);
      toast.success('Project deleted successfully!');
    } catch (error) {
      toast.error('Error deleting project');
    }
  };



  return (
    <div className="py-4 px-2 max-w-7xl mx-auto">
      {showPop && (
        <div
          onClick={() => setShowPop(false)}
          className="fixed top-0 left-0 w-full h-full bg-[#000000a2] flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-center items-center w-[90%] max-w-md"
          >
            <form
              onSubmit={editingId ? handleUpdate : handleAdd}
              className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full"
            >
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-sm py-1 px-2 border border-[#646363] rounded-md focus:outline-blue-500"
                required
                disabled={user?.role !== 'admin'}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 text-sm border border-[#646363] rounded-md focus:outline-blue-500"
                required
                rows={4}
                disabled={user?.role !== 'admin'}
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full py-1 px-2 text-sm border rounded-md focus:outline-blue-500"
              >
                <option value="Not complete">Not complete</option>
                <option value="In progress">In progress</option>
                <option value="Complete">Complete</option>
              </select>

              <div className="flex gap-4 justify-end">
                  <button
                      type="submit"
                      disabled={load}
                      className={`bg-blue-600 text-white text-sm cursor-pointer px-4 py-2 rounded-md transition ${
                        load ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'
                      }`}
                    >
                      {editingId ? 'Update ' : 'Add '}
                </button>


                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-red-500 text-white text-sm px-4 py-2 cursor-pointer rounded-md hover:bg-red-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center  mb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#383838]">Projects</h1>
          <p className="text-sm text-[#525050]">
            Total Number of projects <span>{projects.length}</span>
          </p>
        </div>

        <div className="my-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-[#747373] rounded-md focus:outline-none text-sm"
          />
      </div>


        {user?.role === 'admin' && (
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', description: '', status: 'Not complete' });
              setShowPop(true);
            }}
            className="bg-blue-500 flex items-center gap-1 py-2 px-3 text-white text-sm rounded-lg hover:bg-blue-400"
          >
            <IoIosAdd className="text-xl" />
            New Project
          </button>
        )}
      </div>

      {load ? (
        <p className="text-center text-gray-500 mt-8">Loading projects...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-8">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const statusColor = {
              'Not complete': 'bg-red-200 text-red-800',
              'In progress': 'bg-yellow-200 text-yellow-800',
              Complete: 'bg-green-200 text-green-800',
            }[project.status] || 'bg-gray-200 text-gray-800';

            return (
              <div
                key={project._id}
                className="bg-white rounded-lg border border-[#b3b2b2] p-6 flex flex-col justify-between hover:shadow-xl transform hover:scale-[1.02] transition"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">
                    {project.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{project.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusColor}`}
                  >
                    {project.status}
                  </span>

                  <div className="flex gap-3">
                    {(user?.role === 'admin' || user?.role === 'employee') && (
                      <button
                        onClick={() => startEdit(project)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400 transition text-sm"
                      >
                        <MdOutlineEdit />
                      </button>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
