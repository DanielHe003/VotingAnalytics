import React, { Component } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'; 
import AlabamaData from '../data/JSON-AlabamaData.json';
import CaliforniaData from '../data/JSON-CaliforniaData.json';
import '../stateAnalysis/Sidebar.css'

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


const ChartContainer = ({ categoryData, title, size, selectedDistrict, type }) => {
  if (!categoryData || typeof categoryData !== 'object') {
    console.error('Expected categoryData to be an object but received:', categoryData);
    return null;
  }

  return (
    <div>
      {/* <h4><center>{title}</center></h4> */}
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
      selectedOption: '',
    };
  }

  componentDidMount() {
    const { selectedState, selectedTrend } = this.props;
    const fetchedData = getDataByState(selectedState);
    console.log('Fetched Data:', fetchedData);
    this.setState({ data: fetchedData || {} }, () => {
      this.setAutoSelect();
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      const fetchedData = getDataByState(this.props.selectedState);
      console.log('Fetched Data on Update:', fetchedData);
      this.setState({ data: fetchedData || {} }, () => {
        this.setAutoSelect();
      });
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      this.setAutoSelect();
    }
  }

  setAutoSelect = () => {
    const { selectedTrend } = this.props;
    const options = {
      People: [
        { value: 'sex', label: 'Sex' },
        { value: 'age', label: 'Age Distribution' },
        { value: 'race', label: 'Race' },
      ],
      SocioEconomic: [
        { value: 'meanmedianincome', label: 'Mean/Median Income' },
        { value: 'income', label: 'Income Breakdown' },
      ],
      Business: [
        { value: 'business', label: 'Business Types' },
      ],
      Workers: [
        { value: 'workers2', label: 'Worker Type (Industry)' },
        { value: 'workers1', label: 'Workers (Per Industry)' },
      ],
    };

    const firstOption = options[selectedTrend]?.[0]?.value;
    if (firstOption) {
      this.setState({ selectedOption: firstOption });
    }
  };

  handleSelectChange = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  render() {
    const { selectedTrend, selectedDistrict } = this.props;
    const { data, selectedOption } = this.state;

    const categories = {
      sex: data['Sex'],
      age: data['Age Distribution'],
      race: data['Race'],
      income: data['Income and Benefits'],
      business: data['Total Establishments'],
      workers1: data['Industry Workers (Above 16)'],
      workers2: data['Breakdown of Worker Type (above 16)'],
      meanmedianincome: data['Mean/Median Income'],
    };

    const options = {
      People: [
        { value: 'sex', label: 'Sex' },
        { value: 'age', label: 'Age Distribution' },
        { value: 'race', label: 'Race' },
      ],
      SocioEconomic: [
        { value: 'meanmedianincome', label: 'Mean/Median Income' },
        { value: 'income', label: 'Income Breakdown' },
      ],
      Business: [
        { value: 'business', label: 'Business Types' },
      ],
      Workers: [
        { value: 'workers2', label: 'Worker Type (Industry)' },
        { value: 'workers1', label: 'Workers (Per Industry)' },
      ],
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="dropdown-container" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <select
            value={selectedOption}
            onChange={this.handleSelectChange}
            className="select-width"
            required
          >
            <option value="" disabled>Select an option</option>
            {options[selectedTrend]?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          {selectedTrend === 'People' && (
            <>
              {selectedOption === 'sex' && (
                <ChartContainer
                  categoryData={categories.sex}
                  title="People - Sex"
                  size={{ width: 350, height: 300 }}
                  selectedDistrict={selectedDistrict}
                  type="pie"
                />
              )}
              {selectedOption === 'age' && (
                <ChartContainer
                  categoryData={categories.age}
                  title="People - Age Distribution"
                  size={{ width: 350, height: 350 }}
                  selectedDistrict={selectedDistrict}
                  type="pie"
                />
              )}
              {selectedOption === 'race' && (
                <ChartContainer
                  categoryData={categories.race}
                  title="People - Race"
                  size={{ width: 560, height: 560 }}
                  selectedDistrict={selectedDistrict}
                  type="bar"
                />
              )}
            </>
          )}

          {selectedTrend === 'SocioEconomic' && (
            <>
              {selectedOption === 'meanmedianincome' && (
                <ChartContainer
                  categoryData={categories.meanmedianincome}
                  title="Mean/Median Income"
                  size={{ width: 200, height: 200 }}
                  selectedDistrict={selectedDistrict}
                  type="table"
                />
              )}
              {selectedOption === 'income' && (
                <ChartContainer
                  categoryData={categories.income}
                  title="Income Breakdown"
                  size={{ width: 200, height: 200 }}
                  selectedDistrict={selectedDistrict}
                  type="table"
                />
              )}
            </>
          )}

          {selectedTrend === 'Business' && (
            <>
              {selectedOption === 'business' && (
                <ChartContainer
                  categoryData={categories.business}
                  title="Business Types"
                  size={{ width: 200, height: 200 }}
                  selectedDistrict={selectedDistrict}
                  type="table"
                />
              )}
            </>
          )}

          {selectedTrend === 'Workers' && (
            <>
              {selectedOption === 'workers2' && (
                <ChartContainer
                  categoryData={categories.workers2}
                  title="Worker Type (Industry)"
                  size={{ width: 200, height: 200 }}
                  selectedDistrict={selectedDistrict}
                  type="table"
                />
              )}
              {selectedOption === 'workers1' && (
                <ChartContainer
                  categoryData={categories.workers1}
                  title="Workers (Per Industry)"
                  size={{ width: 200, height: 350 }}
                  selectedDistrict={selectedDistrict}
                  type="table"
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Chart;
