import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from '../Component/Dashboard';
import Employees from '../Component/Employees';
import Projects from '../Component/Projects';
import Tasks from '../Component/Tasks';
import Chat from '../Component/Chat';
import Settings from '../Component/Settings';
import { getEmployees } from '../services/employeesAPI';
import { getProjects } from '../services/projectAPI';

export default function MainDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees only
  const fetchEmployees = useCallback(async () => {
    try {
      const employeeData = await getEmployees();
      setEmployeeCount(employeeData.length);
      setEmployees(employeeData);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  }, []);

  // Fetch projects only
  const fetchProjectsOnly = useCallback(async () => {
    try {
      const projectData = await getProjects();
      setProjectCount(projectData.length);
      setProjects(projectData);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
  try {
    const projectData = await getProjects();  // fetch projects only
    setProjectCount(projectData.length);      // update count in state
    setProjects(projectData);                  // update projects in state
    return projectData;                        // RETURN the projects array
  } catch (err) {
    console.error("Failed to fetch projects", err);
    return [];  // return empty array if error happens
  }
}, []);


  // Fetch both on mount
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
}, [fetchEmployees, fetchProjects]);


  // Completed projects memoized
  const completedProjects = useMemo(() => {
    return projects.filter(
      (p) => p.status.toLowerCase() === 'complete' || p.status.toLowerCase() === 'completed'
    );
  }, [projects]);

  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, { id: Date.now(), msg }]);
  };

  const clearNotifications = () => setNotifications([]);

  const toggleSideNav = () => setIsOpen(!isOpen);

  const navItems = [
    { label: 'Dashboard', key: 'dashboard' },
    { label: 'Employees', key: 'employees' },
    { label: 'Projects', key: 'projects' },
    { label: 'Tasks', key: 'tasks' },
    { label: 'Chat', key: 'chat' },
    { label: 'Settings', key: 'settings' },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            employeeCount={employeeCount}
            projectCount={projectCount}
            employees={employees}
            notifications={notifications}
            clearNotifications={clearNotifications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            completedProjects={completedProjects}
          />
        );
      case 'employees':
        return (
          <Employees
            setEmployeeCount={setEmployeeCount}
            setEmployees={setEmployees}
            addNotification={addNotification}
          />
        );
      case 'projects':
        return (
          <Projects
            projects={projects}
            setProjectCount={setProjectCount}
            refreshProjects={fetchProjects}  // Only refresh projects on update
          />
        );
      case 'tasks':
        return <Tasks completedProjects={completedProjects} />;
      case 'chat':
        return <Chat />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard employeeCount={employeeCount} />;
    }
  };

  const icons = {
    dashboard: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    employees: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    projects: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v1H9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002 2h2" />
      </svg>
    ),
    tasks: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    chat: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v10l-4-4H7a2 2 0 01-2-2V6a2 2 0 012-2h8" />
      </svg>
    ),
    settings: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3a1.5 1.5 0 013 0v1.313a8.022 8.022 0 012.438.719l.926-.926a1.5 1.5 0 112.122 2.122l-.926.926a8.022 8.022 0 01.719 2.438H21a1.5 1.5 0 010 3h-1.313a8.022 8.022 0 01-.719 2.438l.926.926a1.5 1.5 0 11-2.122 2.122l-.926-.926a8.022 8.022 0 01-2.438.719V21a1.5 1.5 0 01-3 0v-1.313a8.022 8.022 0 01-2.438-.719l-.926.926a1.5 1.5 0 01-2.122-2.122l.926-.926a8.022 8.022 0 01-.719-2.438H3a1.5 1.5 0 010-3h1.313a8.022 8.022 0 01.719-2.438l-.926-.926a1.5 1.5 0 012.122-2.122l.926.926a8.022 8.022 0 012.438-.719V3z" />
      </svg>
    )
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-blue-500 text-[#fff] transition-all duration-300 ${
          isOpen ? 'w-50' : 'w-16'
        } relative flex flex-col justify-between h-screen`}
      >
        <div>
          <button
            className="absolute top-4 right-2 bg-white p-1.5 cursor-pointer duration-300 rounded-full text-blue-600 hover:bg-blue-400 hover:text-white"
            onClick={toggleSideNav}
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>

          <div className="mt-16 flex flex-col gap-4 px-1.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center text-[#fff] px-4 py-2 hover:bg-[#cbd8df6b] rounded-lg transition-colors ${
                  activeTab === item.key ? 'bg-white text-blue-500' : ''
                } ${isOpen ? 'justify-start' : 'justify-center'}`}
              >
                {icons[item.key]}
                {isOpen && <span className="ml-4 text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSYNC Footer */}
        <div
          className={`text-center text-white py-4 ${
            isOpen ? '' : 'text-xs rotate-[-90deg] origin-left mb-10 ml-[-10px]'
          }`}
        >
          <h1 className="font-semibold tracking-wide">{isOpen ? 'WORKSYNC' : 'W'}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#f7f7f7] overflow-y-auto">{renderComponent()}</div>
    </div>
  );
}
