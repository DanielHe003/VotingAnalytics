import React, { useState } from "react";
import Navbar from "./components/common/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import StateAnalysis from "./components/StateAnalysis/StateAnalysis";
import StateInfo from "./components/StateInfo/StateInfo";

const App = () => {
  const [activeSection, setActiveSection] = useState("State Insights");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTrend, setSelectedTrend] = useState("");
  const [selectedSubTrend, setSelectedSubTrend] = useState("");
  const [selectedSubSubTrend, setSelectedSubSubTrend] = useState("");
  const [selectedSubSubSubTrend, setSelectedSubSubSubTrend] = useState("");
  const sectionProps = {
    selectedState,
    selectedDistrict,
    selectedTrend,
    selectedSubTrend,
    selectedSubSubTrend,
    selectedSubSubSubTrend,
    setSelectedState,
    setSelectedDistrict,
    setSelectedTrend,
    setSelectedSubTrend,
    setSelectedSubSubTrend,
    setSelectedSubSubSubTrend,
  };

  const navLinks = [
    { name: "State Insights", href: "#state-insights" },
    { name: "State Analysis", href: "#state-analysis" },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "State Analysis":
        return <StateAnalysis {...sectionProps} />;
      case "State Insights":
        return <StateInfo {...sectionProps} />;
      default:
        return <StateInfo {...sectionProps} />;
    }
  };

  return (
    <div>
      <Navbar
        navLinks={navLinks}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div style={{ padding: "12px 2%" }}>{renderSection()}</div>
    </div>
  );
};

export default App;
