import DashTop from '../DashComponent/DashTop'
import Overview from '../DashComponent/Overview';


export default function Dashboard({   employeeCount,
  projectCount,
  employees,
  notifications,
  clearNotifications,
  searchTerm,
  setSearchTerm, }) 
  
  {
    return (
        <div className="flex flex-col items-center gap-5 ">
            <DashTop searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    notifications={notifications}
                    clearNotifications={clearNotifications} />
           <Overview employeeCount={employeeCount} projectCount={projectCount} employees={employees} />
        </div>
    )
}