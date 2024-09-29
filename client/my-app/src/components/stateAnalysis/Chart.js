import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'; 
import AlabamaData from '../data/JSON-AlabamaData.json';
import CaliforniaData from '../data/JSON-CaliforniaData.json';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const getDataByState = (selectedState) => {
  switch (selectedState) {
    case 'Alabama':
      return AlabamaData;
    case 'California':
      return CaliforniaData;
    default:
      return null;
  }
};

const PieChartComponent = ({ categoryData, selectedDistrict, size }) => {
  const pieData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ''), 10),
  }));

  const data = {
    labels: pieData.map(entry => entry.name),
    datasets: [
      {
        data: pieData.map(entry => entry.value),
        backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF45B0'],
        hoverBackgroundColor: ['#007BFF', '#00BFFF', '#FFC107', '#FF7043', '#FF3D8A'],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div style={{ width: size.width, height: size.height }}>
      <Pie data={data} options={options} />
    </div>
  );
};

const BarChartComponent = ({ categoryData, selectedDistrict, size }) => {
  const barData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: parseInt(value[selectedDistrict].replace(/,/g, ''), 10)
  }));

  const data = {
    labels: barData.map(entry => entry.name),
    datasets: [
      {
        label: 'Data Values',
        data: barData.map(entry => entry.value),
        backgroundColor: '#42A5F5',
      },
    ],
  };

  return (
    <div>
      <Bar data={data} options={{ maintainAspectRatio: false }} width={size.width} height={size.height} />
    </div>
  );
};

const TableComponent = ({ categoryData, selectedDistrict }) => {
  const tableData = Object.entries(categoryData).map(([key, value]) => ({
    name: key,
    value: value[selectedDistrict]
  }));

  const styles = {
    table: {
      width: '100%',
      margin: '10px 0',
      fontSize: '16px',
      textAlign: 'center',
      alignItems: 'center',
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


const ChartContainer = ({ categoryData, title, size, selectedDistrict, type }) => {
  if (!categoryData || typeof categoryData !== 'object') {
    console.error('Expected categoryData to be an object but received:', categoryData);
    return null;
  }

  return (
    <div>
      <h3>{title}</h3>
      {type === 'pie' && <PieChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
      {type === 'bar' && <BarChartComponent categoryData={categoryData} size={size} selectedDistrict={selectedDistrict} />}
      {type === 'table' && <TableComponent categoryData={categoryData} selectedDistrict={selectedDistrict} />}
    </div>
  );
};

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    const { selectedState } = this.props;
    const fetchedData = getDataByState(selectedState);
    console.log('Fetched Data:', fetchedData);
    this.setState({ data: fetchedData || {} });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      const fetchedData = getDataByState(this.props.selectedState);
      console.log('Fetched Data on Update:', fetchedData);
      this.setState({ data: fetchedData || {} });
    }
  }

  render() {
    const { selectedTrend, selectedDistrict } = this.props;
    const categories = {
      sex: this.state.data['Sex'],
      age: this.state.data['Age Distribution'],
      race: this.state.data['Race'],
      income: this.state.data['Income and Benefits'],
      business: this.state.data['Total Establishments'],
      workers1: this.state.data['Industry Workers (Above 16)'],
      workers2: this.state.data['Breakdown of Worker Type (above 16)'],
      meanmedianincome: this.state.data['Mean/Median Income']
    };

    return (
      <div>
        <div>
          {selectedTrend === 'People' && (
            <>
              <ChartContainer categoryData={categories.sex} title="People - Sex" size={{ width: 350, height: 300 }} selectedDistrict={selectedDistrict} type="pie" />
              <ChartContainer categoryData={categories.age} title="People - Age Distribution" size={{ width: 350, height: 350 }} selectedDistrict={selectedDistrict} type="pie" />
              <ChartContainer categoryData={categories.race} title="People - Race" size={{ width: 350, height: 350 }} selectedDistrict={selectedDistrict} type="pie" />
            </>
          )}

          {selectedTrend === 'SocioEconomic' && (
            <>
              <ChartContainer categoryData={categories.meanmedianincome} title="Mean/Median Income" size={{ width: 200, height: 200 }} selectedDistrict={selectedDistrict} type="table" />
              <ChartContainer categoryData={categories.income} title="Income Breakdown" size={{ width: 200, height: 200 }} selectedDistrict={selectedDistrict} type="table" />
            </>
          )}

          {selectedTrend === 'Business' && (
            <>
              <ChartContainer categoryData={categories.business} title="Business Types" size={{ width: 200, height: 200 }} selectedDistrict={selectedDistrict} type="table" />
            </>
          )}

          {selectedTrend === 'Workers' && (
            <>
              <ChartContainer categoryData={categories.workers2} title="Worker Type (Industry)" size={{ width: 200, height: 200 }} selectedDistrict={selectedDistrict} type="table" />
              <ChartContainer categoryData={categories.workers1} title="Workers (Per Industry)" size={{ width: 200, height: 350 }} selectedDistrict={selectedDistrict} type="pie" />

            </>
          )}
        </div>
      </div>
    );
  }
}

export default Chart;
