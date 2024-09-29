import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import HomePage from './components/home/HomePage';
import StateAnalysis from './components/stateAnalysis/StateAnalysis'


const App = () => {
  const [activeSection, setActiveSection] = useState('State Analysis');

  const navLinks = [
    // { name: 'State Analysis', href: '#state-analysis' },
    // { name: 'Home', href: '#home' },

  ];

  const renderSection = () => {
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
      <div style={{ padding: '20px 5%' }}>
      {renderSection()}
    </div>
    </div>

  );
};

export default App;