import React, { useState } from 'react';

const TableComponent = ({ data, selectedDistrict, width, height }) => {
  
  // Pagination logic
  const itemsPerPage = 7; // Display 7 rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.values.length / itemsPerPage);

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
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px',
    },
    navigationButton: {
      padding: '5px 10px',
      cursor: 'pointer',
      border: '1px solid #ddd',
      margin: '0 5px',
      backgroundColor: '#f9f9f9',
      transition: 'background-color 0.3s ease',
    },
    counter: {
      padding: '5px 10px',
      backgroundColor: '#005BA6',
      color: 'white',
      border: '1px solid #ddd',
      margin: '0 5px',
    },
  };

  // Data preparation for rendering
  const displayedData = data.values.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <table style={styles.table}>
        <thead>
          <tr>
            {data.labels.map((label, index) => (
              <th key={index} style={styles.header}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((entry, index) => (
            <tr
              key={index}
              style={{
                ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor)}
            >
              {data.labels.map((label, index) => (
                <td key={index} style={styles.cell}>{entry[label]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.navigationButton}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span style={styles.counter}>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            style={styles.navigationButton}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default TableComponent;
