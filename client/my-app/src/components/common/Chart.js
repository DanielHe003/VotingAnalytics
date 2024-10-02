import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import AlabamaData from '../data/JSON-AlabamaData.json';
import CaliforniaData from '../data/JSON-CaliforniaData.json';
import '../stateAnalysis/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartPie, faTable } from '@fortawesome/free-solid-svg-icons';
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

const availableChartTypes = {
  People: ['bar', 'pie', 'table'],
  SocioEconomic: ['bar', 'pie', 'table'],
  Business: ['pie', 'table'],
  Voting: ['bar', 'table'],
  Workers: ['pie', 'table'],
};

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      selectedOption: '',
      selectedView: 'table', // Default view
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

  toggleView = (view) => {
    this.setState({ selectedView: view });
  };

  renderChartOrTable = (type, data, title) => {
    const containerWidth = window.innerWidth * 0.9 * 0.4// 90% of the viewport width
    const containerHeight = window.innerHeight * 0.6 *0.7; // 60% of the viewport height

    return (
      <ChartContainer
        categoryData={data}
        title={title}
        size={{ width: containerWidth, height: containerHeight }}
        selectedDistrict={this.props.selectedDistrict}
        type={type}
      />
    );
  };

  render() {
    const { selectedTrend } = this.props;
    const { data, selectedOption, selectedView } = this.state;

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
    const availableTypes = availableChartTypes[selectedTrend] || [];

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
            onClick={() => this.toggleView('table')}
            style={{
              flex: '0 1 auto',
              backgroundColor: selectedView === 'table' ? '#005BA6' : 'lightgrey',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              outline: 'none',
              fontSize: '13px',
            }}
          >
            <FontAwesomeIcon icon={faTable} />
            <span style={{ marginLeft: '5px' }}>Table View</span>
          </button>

          <button
            onClick={() => this.toggleView('bar')}
            style={{
              flex: '0 1 auto',
              backgroundColor: selectedView === 'bar' ? '#005BA6' : 'lightgrey',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              outline: 'none',
              fontSize: '13px',
            }}
          >
            <FontAwesomeIcon icon={faChartBar} />
            <span style={{ marginLeft: '5px' }}>Bar Chart View</span>
          </button>

          <button
            onClick={() => this.toggleView('pie')}
            style={{
              flex: '0 1 auto',
              backgroundColor: selectedView === 'pie' ? '#005BA6' : 'lightgrey',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              outline: 'none',
              fontSize: '13px',
            }}
          >
            <FontAwesomeIcon icon={faChartPie} />
            <span style={{ marginLeft: '5px' }}>Pie Chart View</span>
          </button>
        </div>

        <div>
          {/* Rendering based on selected view */}
          {selectedView === 'table' && (
            <>
              {selectedTrend === 'Voting' && selectedOption === 'voting' && this.renderChartOrTable('table', categories.votingTrends, 'Voting Trends')}

              {selectedTrend === 'People' && (
                <>
                  {selectedOption === 'sex' && this.renderChartOrTable('table', categories.sex, 'People - Sex')}
                  {selectedOption === 'age' && this.renderChartOrTable('table', categories.age, 'People - Age Distribution')}
                  {selectedOption === 'race' && this.renderChartOrTable('table', categories.race, 'People - Race')}
                </>
              )}

              {selectedTrend === 'SocioEconomic' && (
                <>
                  {selectedOption === 'meanmedianincome' && this.renderChartOrTable('table', categories.meanmedianincome, 'Mean/Median Income')}
                  {selectedOption === 'income' && this.renderChartOrTable('table', categories.income, 'Income Breakdown')}
                </>
              )}

              {selectedTrend === 'Business' && selectedOption === 'business' && this.renderChartOrTable('table', categories.business, 'Business Types')}

              {selectedTrend === 'Workers' && (
                <>
                  {selectedOption === 'workers2' && this.renderChartOrTable('table', categories.workers2, 'Worker Type (Industry)')}
                  {selectedOption === 'workers1' && this.renderChartOrTable('table', categories.workers1, 'Workers (Per Industry)')}
                </>
              )}
            </>
          )}

          {selectedView === 'bar' && (
            <>
              {selectedTrend === 'Voting' && selectedOption === 'voting' && this.renderChartOrTable('bar', categories.votingTrends, 'Voting Trends')}

              {selectedTrend === 'People' && (
                <>
                  {selectedOption === 'sex' && this.renderChartOrTable('bar', categories.sex, 'People - Sex')}
                  {selectedOption === 'age' && this.renderChartOrTable('bar', categories.age, 'People - Age Distribution')}
                  {selectedOption === 'race' && this.renderChartOrTable('bar', categories.race, 'People - Race')}
                </>
              )}

              {selectedTrend === 'SocioEconomic' && (
                <>
                  {selectedOption === 'meanmedianincome' && this.renderChartOrTable('bar', categories.meanmedianincome, 'Mean/Median Income')}
                  {selectedOption === 'income' && this.renderChartOrTable('bar', categories.income, 'Income Breakdown')}
                </>
              )}

              {selectedTrend === 'Business' && selectedOption === 'business' && this.renderChartOrTable('bar', categories.business, 'Business Types')}

              {selectedTrend === 'Workers' && (
                <>
                  {selectedOption === 'workers2' && this.renderChartOrTable('bar', categories.workers2, 'Worker Type (Industry)')}
                  {selectedOption === 'workers1' && this.renderChartOrTable('bar', categories.workers1, 'Workers (Per Industry)')}
                </>
              )}
            </>
          )}

          {selectedView === 'pie' && (
            <>
              {selectedTrend === 'Voting' && selectedOption === 'voting' && this.renderChartOrTable('pie', categories.votingTrends, 'Voting Trends')}

              {selectedTrend === 'People' && (
                <>
                  {selectedOption === 'sex' && this.renderChartOrTable('pie', categories.sex, 'People - Sex')}
                  {selectedOption === 'age' && this.renderChartOrTable('pie', categories.age, 'People - Age Distribution')}
                  {selectedOption === 'race' && this.renderChartOrTable('pie', categories.race, 'People - Race')}
                </>
              )}

              {selectedTrend === 'SocioEconomic' && (
                <>
                  {selectedOption === 'meanmedianincome' && this.renderChartOrTable('pie', categories.meanmedianincome, 'Mean/Median Income')}
                  {selectedOption === 'income' && this.renderChartOrTable('pie', categories.income, 'Income Breakdown')}
                </>
              )}

              {selectedTrend === 'Business' && selectedOption === 'business' && this.renderChartOrTable('pie', categories.business, 'Business Types')}

              {selectedTrend === 'Workers' && (
                <>
                  {selectedOption === 'workers2' && this.renderChartOrTable('pie', categories.workers2, 'Worker Type (Industry)')}
                  {selectedOption === 'workers1' && this.renderChartOrTable('pie', categories.workers1, 'Workers (Per Industry)')}
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
