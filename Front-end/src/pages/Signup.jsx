import { useState, useContext } from "react";
import { signup } from '../services/authAPI';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { RiUserSharedLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

export default function Signup() {
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true)

        try {
        const res = await signup(form);
        login(res.user, res.token);
        navigate('/maindashboard');
        setForm({ name: '', email: '', password: '' }); // ✅ Safe here
    } catch (error) {
        setError(error.response?.data?.message || 'Signup failed');
    } finally {
        setLoading(false); // Stop loading
    }

  };

  return (
    <main className="flex flex-col bg-[#ececec] justify-center items-center w-full h-screen">
        <h1 className="text-[#353434] font-bold text-2xl mb-2">WORKSYNC</h1>
        <p className="text-[#353535] mb-4">Sign in and manage your system</p>


        <div className="flex flex-col justify-center items-center w-80 h-auto bg-white rounded-xl">
          <div className="flex flex-col justify-center items-center p-8 w-full h-[70%]">
          
            <p className="text-[#353535] text-md font-bold mb-4">Sign Up</p>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center gap-2 mb-5 border border-[#9b9999] py-2 px-4 rounded-lg">
                <RiUserSharedLine className="text-[#636262] text-[20px]" />
                <input
                name="name"
                placeholder="UserName"
                value={form.name}
                onChange={handleChange}
                className=" text-sm w-full focus:outline-none "
                required
               />
              </div>

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
              <p className="text-sm text-[#535252]">Have an account?</p>
              <Link to="/login" className="text-sm text-blue-600 ml-1.5 font-semibold hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      
    </main>
  );
}











