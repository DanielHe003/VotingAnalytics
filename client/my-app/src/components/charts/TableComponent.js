const TableComponent = ({ categoryData, selectedDistrict }) => {
    const tableData = Object.entries(categoryData).map(([key, value]) => ({
      name: key,
      value: value[selectedDistrict]
    }));
  
    const styles = {
      table: {
        width: '100%',
        margin: '10px 20px',
        fontSize: '16px',
        textAlign: 'center',
        alignItems: 'center',
        padding: '20px',
      },
      header: {
        backgroundColor: '#005BA6',
        color: 'white',
        fontWeight: 'bold',
        padding: '5px',
        textAlign: 'center', 
      },
      oddRow: {
        backgroundColor: '#f2f2f2',
      },
      evenRow: {
        backgroundColor: '#ffffff',
      },
      cell: {
        padding: '4px', 
        textAlign: 'center',
        borderBottom: '2px solid #ddd', 
      },
      rowHover: {
        backgroundColor: '#d9edf7',
      },
  };
  
  
  
    return (
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
                ...styles.row,
                ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
              }}
            >
              <td style={styles.cell}>{entry.name}</td>
              <td style={styles.cell}>{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  export default TableComponent;