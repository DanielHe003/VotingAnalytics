import React, { Component } from 'react';
import ChartContainer from './ChartContainer';
import AlabamaData from '../data/JSON-AlabamaData.json';
import CaliforniaData from '../data/JSON-CaliforniaData.json';
import '../stateInfo/Sidebar.css';
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
      selectedView: 'table', // default view
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
    hi: [
       { value: 'ecologicalInference', label: 'Ecological Inference' },
    ],
  });

  handleSelectChange = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  toggleView = (view) => {
    this.setState({ selectedView: view });
  };

  renderChartOrTable = (type, data, title) => {
    const containerWidth = window.innerWidth * 0.9 * 0.4; // 90% of the viewport width
    const containerHeight = window.innerHeight * 0.6 * 0.7; // 60% of the viewport height

    return (
      <ChartContainer
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

    let chartType = 'table'; // Default chart type

    // Determine chart type based on the selected option
    if (selectedOption === 'Ecological Inference') {
      chartType = 'scatter'; // Show scatter chart for ecological inference
    } else if (['sex', 'age', 'race'].includes(selectedOption)) {
      chartType = 'pie'; // Show pie chart for demographic data
    } else if (['income', 'workers1', 'workers2'].includes(selectedOption)) {
      chartType = 'bar'; // Show bar chart for income/workers data
    }

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

        {/* Render chart or table based on selected option */}
        {this.renderChartOrTable(chartType, categories[selectedOption], selectedOption)}
      </div>
    );
  }
}

export default Chart;
