import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import PrivateRoutes from './helpers/routes/PrivateRoutes';
import Register from './pages/Register';
import Home from './pages/Home';
import GoogleAuth from './pages/GoogleAuth';


function App() {

  return (


    <>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/google-query/:tokenP' element={<GoogleAuth />} />,

          <Route path='/' element={<PrivateRoutes />}>

            <Route path='/home' element={<Home />} />

          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
