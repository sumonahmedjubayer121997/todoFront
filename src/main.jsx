import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ Fix import
import './index.css';
import App from './App';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TaskBoard from './task/TaskBoard.jsx';
import Todos from './task/Trial.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx'; // ✅ Import PrivateRoute

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protecting routes under PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/TaskBoard" element={<TaskBoard />} />
          <Route path="/Todos" element={<Todos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
