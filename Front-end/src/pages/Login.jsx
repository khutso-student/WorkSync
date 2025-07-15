import { useState, useContext } from "react";
import { login as loginService } from "../services/authAPI";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

import { Link } from "react-router-dom"
export default function Login() {

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const res = await loginService(form);
        login(res.user, res.token); // stores in AuthContext

        // ✅ Save to localStorage so you can access it in Dashboard
        localStorage.setItem('user', JSON.stringify({
          name: res.user.name,   // replace with actual user name field
          role: res.user.role,   // replace with actual user role field
          token: res.token    
        }));

        navigate('/maindashboard');
        setForm({ email: '', password: '' });
      } catch (error) {
        setError(error.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
};



  return (
    <main className="flex flex-col px-2 bg-[#ececec] justify-center items-center w-full h-screen">
        <h1 className="text-[#353434] font-bold text-2xl mb-2">WORKSYNC</h1>
        <p className="text-[#353535] mb-4">Sign in and manage your system</p>


        <div className="flex flex-col justify-center items-center w-70 sm:w-80 h-auto bg-white rounded-xl">
          <div className="flex flex-col justify-center items-center py-2 px-3 w-full h-[70%]">
          
            <p className="text-[#353535] text-md font-bold mb-4">Login</p>

            <form onSubmit={handleSubmit} className="w-full px-2">
              <div className="flex items-center gap-2 mb-5 border border-[#9b9999] py-2 px-4 rounded-lg">
                  <MdOutlineEmail className="text-[#636262] text-[20px]" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="text-sm w-full focus:outline-none "
                    required
                />
              </div>

    
              <div className="flex items-center gap-2 mb-5 border border-[#9b9999] py-2 px-4 rounded-lg">
                  <CiLock className="text-[#636262] text-[20px]" />
                <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="text-sm  w-full focus:outline-none"
                required
                />
              </div>

       
       
            <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 py-1.5 px-5 cursor-pointer text-white rounded-lg text-sm duration-300 ${
                    loading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-400 hover:text-white'
                }`}
                >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            </form>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-center items-center mt-2 w-full">
              <p className="text-sm text-[#535252]">Don't have account?</p>
              <Link to="/signup" className="text-sm text-blue-600 ml-1.5 font-semibold hover:underline">
                Sign up
              </Link>
            </div>

            <div className="flex flex-col justify-center items-center w-full mt-5 py-2">
              <h1 className="text-[#424141] text-sm mb-2 font-bold">Demo Account</h1>
              <p className="text-xs text-[#6b6a6a] mb-1">- admin.khutso@gmail.com / Khutso0000 </p>
              <p className="text-xs text-[#6b6a6a] mb-1">- khutso@gmail.com / Khutso0 </p>
            </div>

          </div>
        </div>
      
    </main>
  );
}