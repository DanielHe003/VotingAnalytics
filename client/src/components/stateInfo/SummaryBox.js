import React from "react";

const SummaryBox = ({ title, content, summaryBoxes, isSpecial }) => (
  <div className={`summary-box ${isSpecial ? 'special' : ''}`}>
    <div className="boxTitle">{title}</div>
    <div className="content">{content}</div>
  </div>
);

export default SummaryBox;
