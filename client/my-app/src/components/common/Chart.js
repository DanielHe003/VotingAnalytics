import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import AlabamaData from '../data/JSON-AlabamaData.json';
import CaliforniaData from '../data/JSON-CaliforniaData.json';
import '../stateAnalysis/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';

import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
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

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      selectedOption: '',
      isTableView: false,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.selectedState);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.fetchData(this.props.selectedState);
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      this.setAutoSelect();
    }
  }

  fetchData = (selectedState) => {
    const fetchedData = getDataByState(selectedState);
    this.setState({ data: fetchedData || {} }, this.setAutoSelect);
  };

  setAutoSelect = () => {
    const { selectedTrend } = this.props;
    const options = this.getOptions();
    const firstOption = options[selectedTrend]?.[0]?.value;
    if (firstOption) {
      this.setState({ selectedOption: firstOption });
    }
  };

  getOptions = () => ({
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
    Voting: [
      { value: 'voting', label: 'Voting Trends' },
    ],
    Workers: [
      { value: 'workers2', label: 'Worker Type (Industry)' },
      { value: 'workers1', label: 'Workers (Per Industry)' },
    ],
  });

  handleSelectChange = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  toggleView = () => {
    this.setState(prevState => ({ isTableView: !prevState.isTableView }));
  };

  renderChartOrTable = (type, data, title, size) => (
    <ChartContainer
      categoryData={data}
      title={title}
      size={size}
      selectedDistrict={this.props.selectedDistrict}
      type={type}
    />
  );

  render() {
    const { selectedTrend } = this.props;
    const { data, selectedOption, isTableView } = this.state;

    const categories = {
      sex: data['Sex'],
      age: data['Age Distribution'],
      race: data['Race'],
      income: data['Income and Benefits'],
      business: data['Total Establishments'],
      workers1: data['Industry Workers (Above 16)'],
      workers2: data['Breakdown of Worker Type (above 16)'],
      meanmedianincome: data['Mean/Median Income'],
      votingTrends: data['Voting'],
    };

    const options = this.getOptions();

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


        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', width: 'auto', padding: '0 20px' }}>
  <button 
    onClick={() => this.toggleView(false)} // Set to Chart view
    style={{
      flex: '0 1 auto', // Allow buttons to shrink and grow based on content
      backgroundColor: !isTableView ? '#005BA6' : 'lightgrey', // Blue if Chart view is active, light grey if not
      color: 'white',
      border: 'none',
      padding: '10px 15px', // Padding for the button
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      outline: 'none',
      fontSize: '13px', // Font size
    }}
  >
    <FontAwesomeIcon icon={faChartBar} />
    <span style={{ marginLeft: '5px' }}>Chart</span>
  </button>

  <button 
    onClick={() => this.toggleView(true)} // Set to Table view
    style={{
      flex: '0 1 auto', // Allow buttons to shrink and grow based on content
      backgroundColor: isTableView ? '#005BA6' : 'lightgrey', // Blue if Table view is active, light grey if not
      color: 'white',
      border: 'none',
      padding: '10px 15px', // Padding for the button
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      outline: 'none',
      fontSize: '13px', // Font size
    }}
  >
    <FontAwesomeIcon icon={faTable} />
    <span style={{ marginLeft: '5px' }}>Table</span>
  </button>
</div>



        <div>
          {isTableView ? (
            <>
              {selectedTrend === 'Voting' && selectedOption === 'voting' && this.renderChartOrTable('table', categories.votingTrends, 'Voting Trends', { width: 400, height: 400 })}

              {selectedTrend === 'People' && (
                <>
                  {selectedOption === 'sex' && this.renderChartOrTable('table', categories.sex, 'People - Sex', { width: 350, height: 300 })}
                  {selectedOption === 'age' && this.renderChartOrTable('table', categories.age, 'People - Age Distribution', { width: 350, height: 350 })}
                  {selectedOption === 'race' && this.renderChartOrTable('table', categories.race, 'People - Race', { width: 560, height: 540 })}
                </>
              )}

              {selectedTrend === 'SocioEconomic' && (
                <>
                  {selectedOption === 'meanmedianincome' && this.renderChartOrTable('table', categories.meanmedianincome, 'Mean/Median Income', { width: 200, height: 200 })}
                  {selectedOption === 'income' && this.renderChartOrTable('table', categories.income, 'Income Breakdown', { width: 200, height: 200 })}
                </>
              )}

              {selectedTrend === 'Business' && selectedOption === 'business' && this.renderChartOrTable('table', categories.business, 'Business Types', { width: 200, height: 200 })}

              {selectedTrend === 'Workers' && (
                <>
                  {selectedOption === 'workers2' && this.renderChartOrTable('table', categories.workers2, 'Worker Type (Industry)', { width: 200, height: 200 })}
                  {selectedOption === 'workers1' && this.renderChartOrTable('table', categories.workers1, 'Workers (Per Industry)', { width: 200, height: 350 })}
                </>
              )}
            </>
          ) : (
            <>
              {selectedTrend === 'Voting' && selectedOption === 'voting' && this.renderChartOrTable('bar', categories.votingTrends, 'Voting Trends', { width: 400, height: 400 })}

              {selectedTrend === 'People' && (
                <>
                  {selectedOption === 'sex' && this.renderChartOrTable('pie', categories.sex, 'People - Sex', { width: 350, height: 300 })}
                  {selectedOption === 'age' && this.renderChartOrTable('pie', categories.age, 'People - Age Distribution', { width: 350, height: 350 })}
                  {selectedOption === 'race' && this.renderChartOrTable('bar', categories.race, 'People - Race', { width: 560, height: 540 })}
                </>
              )}

              {selectedTrend === 'SocioEconomic' && (
                <>
                  {selectedOption === 'meanmedianincome' && this.renderChartOrTable('table', categories.meanmedianincome, 'Mean/Median Income', { width: 200, height: 200 })}
                  {selectedOption === 'income' && this.renderChartOrTable('pie', categories.income, 'Income Breakdown', { width: 200, height: 200 })}
                </>
              )}

              {selectedTrend === 'Business' && selectedOption === 'business' && this.renderChartOrTable('table', categories.business, 'Business Types', { width: 200, height: 200 })}

              {selectedTrend === 'Workers' && (
                <>
                  {selectedOption === 'workers2' && this.renderChartOrTable('pie', categories.workers2, 'Worker Type (Industry)', { width: 200, height: 200 })}
                  {selectedOption === 'workers1' && this.renderChartOrTable('pie', categories.workers1, 'Workers (Per Industry)', { width: 200, height: 350 })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Chart;
