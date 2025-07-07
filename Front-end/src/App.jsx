import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MainDashboard from './pages/MainDashboard'; // this expects a default export
import PrivateRoute from './Component/PrivateRoute'

function App () {
  return(
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/maindashboard" element=
        {
          <PrivateRoute>
            <MainDashboard />
          </PrivateRoute>
        } />

      </Routes>
    </div>
  );
}

export default App;