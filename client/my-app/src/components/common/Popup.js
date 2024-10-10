import React from 'react';

const Popup = ({ isVisible, title, description, onClose }) => {
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
        <h2>{title}</h2>
        <div>{description}</div>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#005BA6', color: '#fff', border: 'none' }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Popup;
