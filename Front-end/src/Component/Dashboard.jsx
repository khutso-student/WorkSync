import { useEffect, useState } from 'react'; // ⬅️ Don't forget this!
import DashTop from '../DashComponent/DashTop';
import Overview from '../DashComponent/Overview';

export default function Dashboard({
  employeeCount,
  projectCount,
  employees,
  notifications,
  clearNotifications,
  searchTerm,
  setSearchTerm,
  completedProjects
 
}) {
  // ✅ useState inside function
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // ✅ store in local state
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 ">
      <DashTop
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        notifications={notifications}
        clearNotifications={clearNotifications}
      />

      <Overview
        employeeCount={employeeCount}
        projectCount={projectCount}
        employees={employees}
        completedProjects={completedProjects}
        users={user ? [user] : []} // ✅ pass as array
      />
    </div>
  );
}
