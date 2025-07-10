import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MainDashboard from './pages/MainDashboard'
import PrivateRoute from './Component/PrivateRoute'
import { ChatProvider } from './context/ChatContext';  // <-- import this

function App() {
  // get the user from localStorage or wherever you store logged-in user info
  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route
          path="/maindashboard"
          element={
            <PrivateRoute>
              <ChatProvider user={storedUser}>
                <MainDashboard />
              </ChatProvider>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
