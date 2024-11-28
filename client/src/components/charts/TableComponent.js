// Example Usage:
// const data = {
//   "Category 1": { districtA: 10, districtB: 15, districtC: 5 },
//   "Category 2": { districtA: 20, districtB: 25, districtC: 30 },
//   "Category 3": { districtA: 5, districtB: 0, districtC: 2 },
//   "Category 4": { districtA: 12, districtB: 22, districtC: 9 },
// };
// <div>
//   <TableComponent height={1000} width={1000} data={data} selectedDistrict={selectedDistrict} />
// </div>

import React from 'react';

const TableComponent = ({ data, selectedDistrict, width, height }) => {
  const tableData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value: value[selectedDistrict],
  }));

  const styles = {
    table: {
      width: '100%',
      margin: '10px 20px',
      fontSize: '16px',
      textAlign: 'left',
      padding: '20px',
      borderCollapse: 'collapse',
    },
    header: {
      backgroundColor: '#005BA6',
      color: 'white',
      fontWeight: 'bold',
      padding: '10px',
    },
    oddRow: {
      backgroundColor: '#f2f2f2',
    },
    evenRow: {
      backgroundColor: '#ffffff',
    },
    cell: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    rowHover: {
      backgroundColor: '#d9edf7',
    },
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Category</th>
            <th style={styles.header}>Count</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((entry, index) => (
            <tr
              key={index}
              style={{
                ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor)}
            >
              <td style={styles.cell}>{entry.name}</td>
              <td style={styles.cell}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
