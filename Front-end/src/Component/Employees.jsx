import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../services/employeesAPI';
import { IoIosAdd } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import toast from 'react-hot-toast';
import SearchInput from '../Component/SearchInput'



export default function Employees({ setEmployeeCount, setEmployees, addNotification }) {
  const { user } = useContext(AuthContext);
  const [localEmployees, setLocalEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', age: '', phone: '' });
  const [showModel, setShowModel] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchEmployees(searchTerm);
  }, 500);

      return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // To load initially:
    useEffect(() => {
      fetchEmployees('');
}, []);



  // Fetch employees
 const fetchEmployees = async (search = '') => {
  setLoading(true);
  try {
    const data = await getEmployees(search); // pass search param here
    setLocalEmployees(data);
    setEmployeeCount(data.length);
  } catch (err) {
    setError('Failed to fetch employees');
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
          const newEmp = await createEmployee(formData);
          const data = await getEmployees();
          setLocalEmployees(data);
          setEmployeeCount(data.length);
          setFormData({ name: '', position: '', age: '', phone: '' });
          setEditingId(null);
          setShowModel(false);
          console.log('Calling addNotification for new employee:', newEmp.name);
          if (addNotification) {
          addNotification(`New employee ${newEmp.name} added`);
        }
          toast.success('Employee added successfully!');

    } catch {
     toast.error('Error adding employee');
    }
};



    const startEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({ ...employee });
    setShowModel(true); // <-- this opens the modal
  };


  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', position: '', age: '', phone: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(editingId, formData);
      fetchEmployees();
      setEditingId(null);
      setFormData({ name: '', position: '', age: '', phone: '' });
      setShowModel(false); // closes the modal after update
      if (addNotification) {
      addNotification(`Employee ${formData.name} updated`);
    }

      toast.success('Employee updated successfully!');
    } catch {
      toast.error('Error updating employee');
    }
};


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      const data = await getEmployees(); // ✅ Fetch fresh data
      setLocalEmployees(data);
      setEmployeeCount(data.length);
      if (addNotification) {
      addNotification(`Employee deleted`);
      }

      toast.success('Employee deleted successfully!');
    } catch {
      toast.error('Error deleting employee');
    }
};


  return (
    <div className='w-full h-screen p-2'>
      <div className='flex justify-between items-center  mb-5 p-2'>
        <div>
          <h2 className='text-3xl font-bold text-[#383838]'>Employees</h2>
         <p className='text-sm text-[#4e4e4e]'>Total Number of employees <span>{localEmployees.length}</span></p>
        </div>


         <div className="">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              disabled={loading}
            />

        </div>


          {user?.role === 'admin' && ( 
          <div>
            <button onClick={() => setShowModel(!showModel)}
              className='bg-blue-400 py-1 px-5 rounded-lg cursor-pointer hover:bg-blue-300'>
              {showModel ? <CiCircleRemove className="text-blue-600" /> : <IoIosAdd className="text-blue-600" />}
            </button>

            {showModel && (
                <div className='fixed left-0 top-0 w-full h-full bg-[#000000a8] flex justify-center items-center'
                      onClick={() => setShowModel(false)}>
                  <div className='bg-white w-70 h-auto rounded-xl flex flex-col justify-center items-center py-3 px-4'
                      onClick={(e) => e.stopPropagation()}>
                        <h1 className='text-[#2c2b2b] font-bold mb-4'>Add Employees</h1>

                      <form className='flex flex-col w-full'
                        onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1rem' }}>
                          <input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full text-sm py-1.5 px-2 mb-4 border-1 border-[#727171] rounded focus:outline-[#696969]'
                            required
                          />
                          <input
                            name="position"
                            placeholder="Position"
                            value={formData.position}
                            onChange={handleChange}
                            className='w-full text-sm py-1.5 px-2 mb-4 border-1 border-[#727171] rounded focus:outline-[#696969]'
                            required
                          />
                          <input
                            name="age"
                            type="number"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className='w-full text-sm py-1.5 px-2 mb-4 border-1 border-[#727171] rounded focus:outline-[#696969]'
                            required
                          />
                          <input
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className='w-full text-sm py-1.5 px-2 mb-4 border-1 border-[#727171] rounded focus:outline-[#696969]'
                            required
                          />
                          <div className='flex justify-end gap-2 items-center p-1 w-full '>
                            <button type="submit" className='bg-blue-500 py-2 px-3 text-xs  cursor-pointer text-white rounded-md hover:bg-[#272727] duration-300'
                          >{editingId ? 'Update' : 'Add'}</button>
                          {editingId && <button onClick={cancelEdit} type="button"
                          className='bg-red-500 text-white text-xs  py-2 px-3 rounded-lg'>
                            Cancel</button>}
                          </div>

                      </form>
                  </div>
              
                </div>

            
              )}
    
          </div>
          )}
      </div>
     
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}



    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Position</th>
              <th scope="col" className="px-6 py-3">Age</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              {user?.role === 'admin' && (
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {localEmployees.map((emp, idx) => (
              <tr
                key={emp._id}
                className={`border-b border-[#b6b0b0] ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.position}</td>
                <td className="px-6 py-4">{emp.age}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                {user?.role === 'admin' && (
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() => startEdit(emp)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
    </div>


      {user?.role !== 'admin' && (
        <p className='text-xs text-[#666464] mt-3'>You have read-only access to employees.</p>
      )}


    </div>
  );
}
