import React, { Component } from 'react';
import ChartContainer from '../common/ChartContainer';
import '../stateInfo/topBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartPie, faTable } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: '',
      selectedView: 'table', 
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

  fetchData = () => {
    const fetchedData = null; 
    this.setState({ data: fetchedData });
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
    return (
      <ChartContainer
        categoryData={data}
        title={title}
        selectedDistrict={this.props.selectedDistrict}
        type={type}
      />
    );
  };

  render() {
    const categories = {
      sex: this.props.data['Sex'],
      age: this.props.data['Age Distribution'],
      race: this.props.data['Race'],
      income: this.props.data['Income and Benefits'],
      business: this.props.data['Total Establishments'],
      workers1: this.props.data['Industry Workers (Above 16)'],
      workers2: this.props.data['Breakdown of Worker Type (above 16)'],
      meanmedianincome: this.props.data['Mean/Median Income'],
      votingTrends: this.props.data['Voting'],
    };

    const options = this.getOptions();
    const { selectedOption, selectedView } = this.state;
    const selectedTrend = this.props.selectedTrend;

    const chartData = {
      table: {
        'voting': categories.votingTrends,
        'sex': categories.sex,
        'age': categories.age,
        'race': categories.race,
        'meanmedianincome': categories.meanmedianincome,
        'income': categories.income,
        'business': categories.business,
        'workers2': categories.workers2,
        'workers1': categories.workers1,
      },
      bar: {
        'voting': categories.votingTrends,
        'sex': categories.sex,
        'age': categories.age,
        'race': categories.race,
        'meanmedianincome': categories.meanmedianincome,
        'income': categories.income,
        'business': categories.business,
        'workers2': categories.workers2,
        'workers1': categories.workers1,
      },
      pie: {
        'voting': categories.votingTrends,
        'sex': categories.sex,
        'age': categories.age,
        'race': categories.race,
        'meanmedianincome': categories.meanmedianincome,
        'income': categories.income,
        'business': categories.business,
        'workers2': categories.workers2,
        'workers1': categories.workers1,
      }
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

        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', width: 'auto', padding: '0 20px' }}>
          {['table', 'bar', 'pie'].map(view => (
            <button
              key={view}
              onClick={() => this.toggleView(view)}
              style={{
                flex: '0 1 auto',
                backgroundColor: selectedView === view ? '#005BA6' : 'lightgrey',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                outline: 'none',
                fontSize: '13px',
              }}
            >
              <FontAwesomeIcon icon={view === 'table' ? faTable : view === 'bar' ? faChartBar : faChartPie} />
              <span style={{ marginLeft: '5px' }}>
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </span>
            </button>
          ))}
        </div>

        <div>
          {['table', 'bar', 'pie'].map(view => (
            selectedView === view && selectedOption && (
              <div key={view}>
                {this.renderChartOrTable(view, chartData[view][selectedOption], `${selectedTrend} - ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}`)}
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
}

export default Chart;