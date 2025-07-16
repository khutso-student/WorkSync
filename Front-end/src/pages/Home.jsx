import { Link } from "react-router-dom"
import '../style/Home.css';
import Logo from '../assets/Logo.svg';


export default function Home() {
    return(
        <div className="w-full h-screen bg-[url('src/assets/Signup.jpg')] bg-cover bg-center ">
            <div className="w-full h-full bg-[#030f1bd2] flex flex-col items-center gap-10">
                <div className="flex justify-between items-center mt-5 bg-[#030f1bd2] w-[90%] sm:w-[80%] py-3 px-2.5 sm:px-4 rounded-xl">
                  <a href="">    
                    <img src={Logo} className="w-20 shadow-none" alt="Website Logo" />
                   </a>
                

                    <div className="flex gap-2 p-2">
                        <Link to='/login'
                            className="bg-blue-500 py-1 px-3 md:px-5 text-sm text-white rounded-md hover:bg-blue-400  duration-300">
                            Login
                        </Link>

                        <Link to='/signup'
                            className="border border-[#9b9a9a] py-1 px-1 md:px-3 text-sm text-white rounded-md hover:bg-blue-400 hover:text-white hover:border-blue-400  duration-300">
                            Sign Up
                        </Link>
                    </div>
                </div>

                <div className="w-[90%] sm:w-[70%] h-full flex flex-col justify-center items-center">
                    <h1 className="text-white text-[20px] sm:text-[35px] text-center mb-5">
                        Welcome to <span className="text-blue-500 font-bold">WorkSync</span>  – Your Smart Employee Management Solution
                    </h1>
                    <p className="text-white text-center text-sm sm:text-md mb-4">
                        WorkSync is a modern, web-based Employee Management System designed to streamline team coordination, project tracking, and workplace communication. Whether you're a small team or a growing company, WorkSync helps you stay organized, improve productivity, and make informed decisions.
                    </p>
                    <Link to='/signup' className="bg-blue-500 hover:bg-blue-400 py-1.5 px-4 text-white rounded-sm">
                    Get Started
                    </Link>
                </div>
              
            </div>
        </div>
    )
}