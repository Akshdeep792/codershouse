
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Authenticate from './pages/Authenticate.jsx/Autheticate';
import GuestRoute from './utils/GuestRoutes';
function App() {
  return (

    // Make guest route ---> if logged in than redirect to rooms page.
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<GuestRoute> <Home /></GuestRoute>} />
        {/* <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} /> */}
        <Route path='/authenticate' element={<GuestRoute><Authenticate /></GuestRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
