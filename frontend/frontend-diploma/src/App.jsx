import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import AboutPage from './components/About';
import Login from './components/Auth/Login';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import DataUploadPage from './components/DataUploadPage';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<PredictionForm />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/data-upload" element={<DataUploadPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
