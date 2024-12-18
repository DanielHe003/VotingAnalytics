import React, { useState } from 'react';

const TableComponent = ({ data, minCount, selectedDistrict, width, height, hoverEffect }) => {
  // console.log(hoverEffect);

  // Pagination logic
  const itemsPerPage = minCount != null ? minCount : 7;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = data ? Math.ceil(data.values.length / itemsPerPage) : 0;

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
      padding: '5px',
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
      border: 'none',
      margin: '0 5px',
      backgroundColor: 'transparent', // Make background transparent
      color: '#005BA6', // Match theme color
      fontSize: '20px', // Larger font for arrows
      transition: 'transform 0.3s ease',
    },
    disabledButton: {
      color: '#ccc', // Disabled button color
      cursor: 'not-allowed',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#005BA6',
      marginTop: '20px',
    },
  };

  // Data preparation for rendering
  const displayedData = data ? data.values.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];

  if (!data) {
    return <div style={styles.loading}>Loading data, please wait...</div>;
  }

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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor;
                hoverEffect(index, true); // Pass index for hover effect
              }}
              onMouseLeave={(e) => {
                (e.currentTarget.style.backgroundColor = index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor);
                hoverEffect(index, false);
              }}
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
            style={{
              ...styles.navigationButton,
              ...(currentPage === 1 ? styles.disabledButton : {}),
            }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt; {/* Left arrow symbol */}
          </button>
          <button
            style={{
              ...styles.navigationButton,
              ...(currentPage === totalPages ? styles.disabledButton : {}),
            }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt; {/* Right arrow symbol */}
          </button>
        </div>
      )}
    </>
  );
};

export default TableComponent;
