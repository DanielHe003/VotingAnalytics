import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import StateAnalysis from './components/home/StateAnalysis';
import StateInfo from './components/stateInfo/StateInfo'
import Value from './components/home/Value';


const App = () => {
  const [activeSection, setActiveSection] = useState('State Insights');

  const navLinks = [
    { name: 'State Insights', href: '#state-analysis' },
    { name: 'State Analysis', href: '#state-analysis' },
    // {name: 'POC', href: '#sample'}

  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'POC':
        return <Value />;
      case 'State Analysis':
        return <StateAnalysis />;
      case 'State Insights':
        return <StateInfo />;
      default:
        return <StateInfo />;
    }
  };

  return (
<div>

      <Navbar navLinks={navLinks} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div style={{ padding: '20px 2%' }}>
      {renderSection()}
    </div>
    </div>

  );
};

export default App;

