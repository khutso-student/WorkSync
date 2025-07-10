import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { IoDownload } from "react-icons/io5";
import setAuthToken from '../utils/setAuthToken';

export default function ProjectsProgress() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenAvailable, setTokenAvailable] = useState(true);
  const chartRef = useRef();

  const getMonth = (dateStr) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[new Date(dateStr).getMonth()];
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token;

      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        setTokenAvailable(false);
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token); // ✅ set token globally for axios

        const [projectsRes, employeesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/employees'),
        ]);

        const projectData = projectsRes.data;
        const employeeData = employeesRes.data;

        const monthMap = {};

        projectData.forEach(p => {
          const month = getMonth(p.createdAt || p.date || p.timestamp);
          if (!monthMap[month]) monthMap[month] = { month, projects: 0, employees: 0 };
          monthMap[month].projects++;
        });

        employeeData.forEach(e => {
          const month = getMonth(e.createdAt || e.joinDate || e.timestamp);
          if (!monthMap[month]) monthMap[month] = { month, projects: 0, employees: 0 };
          monthMap[month].employees++;
        });

        const orderedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const finalData = orderedMonths.map(m => monthMap[m] || { month: m, projects: 0, employees: 0 });

        setChartData(finalData);
      } catch (err) {
        console.error("❌ Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = 'project-progress-chart.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (loading) return <div className="p-4 text-center">Loading chart...</div>;
  if (!tokenAvailable) return <div className="p-4 text-center text-red-600">🔒 You must be logged in to view progress.</div>;

  return (
    <main className="flex justify-between gap-2 items-center w-full h-auto py-1.5 rounded-lg">
      <div className='w-full border border-[#e3eff0] rounded-xl py-2 px-2'>
        <div className='flex justify-between items-center border-b border-[#a3a0a0] w-full px-1 py-3'>
          <h1 className="text-[#252525] font-semibold">Project Progress Section</h1>
          <button
            onClick={handleDownload}
            className="flex justify-center items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-3 py-1.5 rounded text-sm"
          >
            <IoDownload className='text-[17px] mb-0.5' /> Export PNG
          </button>
        </div>

        <div className='flex justify-between gap-2 w-full h-full' ref={chartRef}>
          <div className='flex flex-col justify-between text-center py-8'>
            <div>
              <h1 className='text-[30px] text-[#0f0f0f] font-bold'>75%</h1>
              <p className='text-sm text-[#3d3c3c]'>WorkSync Redesign</p>
            </div>
            <div>
              <h1 className='text-[25px] text-[#202020] font-bold'>100%</h1>
              <p className='text-sm text-[#3d3c3c]'>HR System API</p>
            </div>
          </div>

          <div className="rounded-xl p-2 w-[80%] h-80">
            <h2 className="text-lg font-semibold text-[#252525] mb-2">Growth Overview</h2>
            <ResponsiveContainer width="95%" height="90%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={3} name="Projects" />
                <Line type="monotone" dataKey="employees" stroke="#10b981" strokeWidth={3} name="Employees" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}
