import React from "react";

const SummaryBox = ({ title, content, summaryBoxes, isSpecial }) => (
  <>
  <h3>{title}</h3>
  {summaryBoxes.map((box, index) => (
      <div className="summary-box">  
      <div className="boxTitle">{box.title}</div>
      <div className="content">{box.content}</div>
    </div>  
  
              ))}

  </>
);

export default SummaryBox;
