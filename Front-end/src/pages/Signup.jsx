import { useState, useContext } from "react";
import { signup } from '../services/authAPI';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
    <main className="flex justify-center items-center w-full h-screen">
      <div className="bg-[url('src/assets/Signup.jpg')] bg-cover bg-center h-[55%] w-80 rounded-xl">
        <div className="flex flex-col justify-center items-center w-full h-full bg-[#111111f6] rounded-xl">
          <div className="flex flex-col justify-center items-center p-8 w-full h-[70%]">
            <h1 className="text-white font-semibold text-xl mb-4">WORKSYNC</h1>
            <p className="text-white text-md font-bold mb-1">Sign Up</p>

            <form onSubmit={handleSubmit} className="w-full">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="text-white border-b text-sm border-[#fff] w-full focus:outline-none mb-5"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="text-white border-b text-sm border-[#fff] w-full focus:outline-none mb-5"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
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
              <p className="text-sm text-white">Have an account?</p>
              <Link to="/login" className="text-sm text-white ml-1.5 font-semibold hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}











