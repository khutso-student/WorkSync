import { useState, useContext } from "react";
import { login as loginService } from "../services/authAPI";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
        setLoading(true); // Start loading

    try {
        const res = await loginService(form);
        login(res.user, res.token);
        navigate('/maindashboard');
        setForm({ email: '', password: '' });
    } catch (error) {
        setError(error.response?.data?.message || 'Login failed');
    } finally {
        setLoading(false); // Stop loading
    }
};


  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className="bg-[url('src/assets/Signup.jpg')] bg-cover bg-center h-[55%] w-80 rounded-xl">
        <div className="flex flex-col justify-center items-center w-full h-full bg-[#111111f6] rounded-xl">
          <div className="flex flex-col justify-center items-center p-8 w-full h-[70%]">
            <h1 className="text-white font-semibold text-xl mb-4">WORKSYNC</h1>
            <p className="text-white text-md font-bold mb-1">Login Up</p>

            <form onSubmit={handleSubmit} className="w-full">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
               
                className="text-white border-b text-sm border-[#fff] w-full focus:outline-none mb-5"
                required
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
             
                className="text-white border-b text-sm border-[#fff] w-full focus:outline-none mb-5"
                required
              />
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-1.5 px-5 cursor-pointer rounded-lg text-sm duration-300 ${
                    loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white hover:bg-[#363636] hover:text-white'
                }`}
                >
                {loading ? 'Logging in...' : 'Login'}
            </button>

            </form>

             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="flex justify-center items-center mt-2 w-full">
              <p className="text-sm text-white">Don't have account?</p>
              <Link to="/signup" className="text-sm text-white ml-1.5 font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}