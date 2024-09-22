import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import HomePage from './components/home/HomePage';
import StateAnalysis from './components/stateAnalysis/StateAnalysis'

const App = () => {
  const [activeSection, setActiveSection] = useState('home'); 

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'State Analysis', href: '#state-analysis' },
  ];

  const renderSection = () => {
    console.log("chaning render");
    switch (activeSection) {
      case 'Home':
        return <HomePage />;
      case 'State Analysis':
        return <StateAnalysis />; 
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      <Navbar navLinks={navLinks} activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="container mt-4 d-flex" style={{ height: '70vh' }}>
        <div style={{ width: '1px', backgroundColor: 'white', height: 'auto', margin: '0 20px' }} />
        <div style={{ flexGrow: 1 }}>{renderSection()}</div>
      </main>
    </div>
  );
  
};

export default App;