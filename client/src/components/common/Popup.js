import React from "react";

class Popup extends React.Component {
  renderStateDescription(selectedState) {
    switch (selectedState) {
      case 'Alabama':
        return (
          <span>
            In Alabama, the redistricting process is primarily controlled by the state legislature, 
            with some opportunity for public input. The governor also plays a significant role in 
            approving the maps, and they may be subject to judicial review.
          </span>
        );
      case 'California':
        return (
          <span>
            California uses an independent commission for redistricting, emphasizing public input 
            and transparency in the process. The California Citizens Redistricting Commission 
            draws district maps, and these can be challenged in court to prevent gerrymandering.
          </span>
        );
      default:
        return <span>Please select a state to see its redistricting process.</span>;
    }
  }

  render() {
    const { state, isVisible, onClose } = this.props;

    const popupStyle = {
      display: isVisible ? 'block' : 'none',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      padding: '30px',
      zIndex: 1000,
      maxWidth: '400px',
      width: '90%',
    };

    const overlayStyle = {
      display: isVisible ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 999,
    };

    return (
      <>
        <div style={overlayStyle} onClick={onClose} />
        <div style={popupStyle}>
          <h2>{state} Redistricting Process</h2>
          <p>{this.renderStateDescription(state)}</p>
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 15px',
                borderRadius: '5px',
                backgroundColor: '#005BA6',
                color: '#fff',
                border: 'none',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Popup;
