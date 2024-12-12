import React from "react";

const SummaryBox = ({ title, content, isSpecial }) => (
  <div className={`summary-box ${isSpecial ? "special-box" : ""}`}>
    <div className="boxTitle">{title}</div>
    <div className="content">{content}</div>
  </div>
);

export default SummaryBox;
