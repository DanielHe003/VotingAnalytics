import React from 'react';
const Sidebar = () => {
  const togglePopup = (filter) => {
    window.alert(`Filter selected: ${filter}`);
  };

  return (
    <div style={cloudBoxStyle}>
      <h2 style={titleStyle}>Filters</h2>

      <div style={iconRowStyle}>
        <div style={filterItemStyle}>
          <img 
            src="/headerImages/ALIcon.png" 
            alt="State 1" 
            onClick={() => togglePopup('State 1')} 
            style={iconStyle} 
          />
          <p style={tinyTextStyle}>Alabama</p>
        </div>
        <div style={verticalLineStyle} />
        <div style={filterItemStyle}>
          <img 
            src="/headerImages/CAIcon.png" 
            alt="State 2" 
            onClick={() => togglePopup('State 2')} 
            style={iconStyle} 
          />
          <p style={tinyTextStyle}>California</p>
        </div>
      </div>

      <div style={iconRowStyle}>
        <div style={filterItemStyle}>
          <img 
            src="/headerImages/ALIcon.png" 
            alt="State 1" 
            onClick={() => togglePopup('State 1')} 
            style={iconStyle} 
          />
          <p style={tinyTextStyle}>Voting Trends</p>
        </div>
        <div style={verticalLineStyle} />
        <div style={filterItemStyle}>
          <img 
            src="/headerImages/CAIcon.png" 
            alt="State 2" 
            onClick={() => togglePopup('State 2')} 
            style={iconStyle} 
          />
          <p style={tinyTextStyle}>Economic Trends</p>
        </div>
      </div>



    </div>
  );
};

export default Sidebar;

const cloudBoxStyle = {
  width: '20%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '20px',
};

const titleStyle = {
  fontSize: '24px',
  margin: '0 0 20px 0',
  textAlign: 'center',
};

const iconRowStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: '20px',
};

const iconStyle = {
  width: '40px',
  height: '40px',
  cursor: 'pointer',
};

const tinyTextStyle = {
  fontSize: '12px',
  textAlign: 'center',
  marginTop: '5px',
};

const filterItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const verticalLineStyle = {
  width: '1px',
  height: '40px',
  backgroundColor: 'black',
};
