import React from "react";

class SummaryBox extends React.Component {
    render() {
      return (
        <div className="summary-box">
          <h3 className="boxTitle">{this.props.title}</h3>
          <div className="content">{this.props.content}</div>
        </div>
      );
    }
  }

  export default SummaryBox;