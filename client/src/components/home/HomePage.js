import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography } from '@mui/material';

const HomePage = ({ navLinks, activeSection, setActiveSection }) => {
  return (
    <div style={{ padding: '0 10%' }}>
      <h1>Home Page In Progress</h1>

      <Box display="flex" alignItems="center" marginTop={4}>
        <FontAwesomeIcon icon={faChartLine} size="2x" style={{ marginRight: '8px' }} />
        <Typography variant="h5">State Analysis</Typography>
      </Box>

      <Box display="flex" alignItems="center" marginTop={2}>
        <FontAwesomeIcon icon={faInfoCircle} size="2x" style={{ marginRight: '8px' }} />
        <Typography variant="h5">Info</Typography>
      </Box>
    </div>
  );
};

export default HomePage;
