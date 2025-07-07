import ProjectsProgress from '../DashComponent/ProjectsProgress';
import { IoPeopleOutline } from "react-icons/io5";
import { GoProjectRoadmap, GoTasklist } from "react-icons/go";
import { SlEvent } from "react-icons/sl";

const StatCard = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="flex items-center gap-2 p-1 bg-white border border-[#d3cfcf] w-45 h-23 rounded-lg">
    <div className={`${bgColor} p-3 rounded-full`}>
      <div className={`${iconColor} text-[20px]`}>{icon}</div>
    </div>
    <div>
      <p className="text-sm text-[#4b4b4b]">{label}</p>
      <h1 className="text-[#222121] font-bold">{value}</h1>
    </div>
  </div>
);

export default function Overview({ employeeCount, projectCount, employees= [] }) {
  return (
    <main className="flex flex-col md:flex-row justify-center gap-4 w-full h-auto">
      {/* Overview Section */}
      <div className="flex flex-col w-full md:w-2/3 px-2 border border-[#ebebeb] rounded-sm">
        <div className="flex justify-between items-center px-1 py-2">
          <h1 className="text-[#252525] font-semibold">Overview</h1>
          <h1 className="text-[#252525] font-semibold">Weekly</h1>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 py-2 px-1">
          <StatCard
            icon={<IoPeopleOutline />}
            label="Total Employees"
            value={employeeCount}
            bgColor="bg-blue-300"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={<GoProjectRoadmap />}
            label="Projects"
            value={projectCount}
            bgColor="bg-red-300"
            iconColor="text-red-600"
          />
          <StatCard
            icon={<GoTasklist />}
            label="Task Completed"
            value={0}
            bgColor="bg-green-300"
            iconColor="text-green-600"
          />
          <StatCard
            icon={<SlEvent />}
            label="Events"
            value={0}
            bgColor="bg-purple-400"
            iconColor="text-purple-600"
          />
        </div>

        <ProjectsProgress />
      </div>

      {/* Recent Employees Section */}
      <div className="flex flex-col  h-auto md:w-1/3 p-2 border border-[#ebebeb] rounded-sm">
        <div className="flex justify-between items-center w-full py-2 px-2">
          <h1 className="text-[#252525] font-semibold">Recent Employees</h1>
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
          {employees.slice(-6).reverse().map((emp) => (
            <div key={emp._id} className="bg-white p-4 shadow rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-[#222627]">{emp.name}</h3>
              <p className="text-sm text-gray-600">{emp.position}</p>
            </div>
          ))}
        </div>

        <div className='border border-[#ebebeb] rounded-sm p-2 h-full'>
            <p className='text-[#252525] font-semibold'>Upcoming Events</p>
        </div>
      </div>
    </main>
  );
}

