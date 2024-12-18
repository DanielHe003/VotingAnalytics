import React from "react";

const SummaryBoxComponent = ({ title, content, summaryBoxes, isSpecial }) => (
  <div className="summary-box">  
      <div className="boxTitle">{title}</div>
      <div className="content">{content}</div>
  </div>  
);

export default SummaryBoxComponent;
