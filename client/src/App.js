import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import StateAnalysis from './components/stateAnalysis/stateAnalysis';
import StateInfo from './components/stateInfo/stateInfo';

const App = () => {
  const [activeSection, setActiveSection] = useState('State Insights');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTrend, setSelectedTrend] = useState('');

  const sectionProps = {selectedState, selectedDistrict, selectedTrend, setSelectedState, setSelectedDistrict, setSelectedTrend};

  const navLinks = [
    { name: 'State Insights', href: '#state-insights' },
    { name: 'State Analysis', href: '#state-analysis' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'State Analysis':
        return <StateAnalysis {...sectionProps} />;
      case 'State Insights':
        return <StateInfo {...sectionProps} />;
      default:
        return <StateInfo {...sectionProps} />;
    }
  };

  return (
    <div>
      <Navbar navLinks={navLinks} activeSection={activeSection} setActiveSection={setActiveSection} />
      <div style={{ padding: '12px 2%' }}>
        {renderSection()}
      </div>
    </div>
  );
};

export default App;