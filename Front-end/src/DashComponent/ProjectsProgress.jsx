import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function ProjectsProgress() {

    const data = [
        { name: 'Jan', users: 30 },
        { name: 'Feb', users: 45 },
        { name: 'Mar', users: 60 },
        { name: 'Apr', users: 40 },
        { name: 'May', users: 80 },
        { name: 'Jun', users: 65 },
];

    return(
        <main className="flex  justify-between gap-2 items-center w-full h-auto py-1.5 rounded-lg">
            <div className='w-full border-1 border-[#e3eff0] rounded-xl h-auto py-2 px-2 '>
                <div className='flex justify-between items-center border-b-1 border-[#a3a0a0] w-full px-1 py-3'>
                    <h1 className="text-[#252525] font-semibold">Project Progress Section</h1>
                    <h1 className="text-[#252525] font-semibold">Monthly</h1>
                </div>
                <div className='flex justify-between gap-2 w-full h-full'>
                    <div className='flex flex-col justify-between text-center py-8 '>
                         <div>
                            <h1 className='text-[30px] text-[#0f0f0f] font-bold'>75%</h1>
                            <p className='text-sm text-[#3d3c3c]'>WorkSync Redesign</p>
                         </div>

                        <div> 
                            <h1 className='text-[25px] text-[#202020] font-bold'>100%</h1>
                            <p className='text-sm text-[#3d3c3c]'>HR System API</p>
                        </div>
                    </div>

                    <div className=" rounded-xl   p-2 w-[80%] h-80 ">
                        <h2 className="text-lg font-semibold text-[#252525] mb-2">User Growth</h2>
                        <ResponsiveContainer width="90%" height="90%">
                            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


        </main>
    )
}




