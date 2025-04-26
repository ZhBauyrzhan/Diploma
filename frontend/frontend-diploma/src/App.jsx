import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';

function App() {
  return (
    <div className="App">
      <CustomNavbar />
      <PredictionForm />
    </div>
  );
}

export default App;
