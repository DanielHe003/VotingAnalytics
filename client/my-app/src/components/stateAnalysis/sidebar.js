import React from 'react';
import './Sidebar.css';

const colors = {
    demoBlue: '#005BA6',
    demoGray: '#D6D6D6',
    demoPlaceholder: '#C7C7C7',
    demoBorder: '#E6E6E6',
};

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedState: '',
            selectedDistrict: '',
            selectedTrend: '',
        };

        // Binding methods to `this`
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleTrendChange = this.handleTrendChange.bind(this);
        this.handleResetFilters = this.handleResetFilters.bind(this);
    }

    filterOptions = [
        {
            name: 'Select State',
            options: [
                { id: 'AL', name: 'Alabama', districtsCount: 7 },
                { id: 'CA', name: 'California', districtsCount: 52 },
            ],
        },
        {
            name: 'Select District',
        },
        {
            name: 'Select Trend',
            options: [
                { id: 'voting', name: 'Voting Trends' },
                { id: 'people', name: 'People Trends' },
                { id: 'housing', name: 'Housing Trends' },
                { id: 'socioEconomic', name: 'Socio-Economic Trends' },
                { id: 'education', name: 'Education Trends' },
                { id: 'business', name: 'Business Trends' },
            ],
        },
    ];

    handleStateChange(event) {
        const selectedState = event.target.value;
        this.setState({
            selectedState: selectedState,
            selectedDistrict: 'All Districts',
            selectedTrend: '',
        });
        this.props.setSelectedState(selectedState);
        this.props.setSelectedDistrict('All Districts');
        this.props.setSelectedTrend('');
    }

    handleDistrictChange(event) {
        const selectedDistrict = event.target.value;
        this.setState({ selectedDistrict: selectedDistrict });
        this.props.setSelectedDistrict(selectedDistrict);
    }

    handleTrendChange(event) {
        const selectedTrend = event.target.value;
        this.setState({ selectedTrend: selectedTrend });
        this.props.setSelectedTrend(selectedTrend);
    }

    handleResetFilters() {
        this.setState({
            selectedState: '',
            selectedDistrict: '',
            selectedTrend: '',
        });
        this.props.setSelectedState('');
        this.props.setSelectedDistrict('');
        this.props.setSelectedTrend('');
    }

    getDistrictOptions() {
        if (!this.state.selectedState) return [];

        const state = this.filterOptions[0].options.find(option => option.id === this.state.selectedState);
        const districts = [{ id: '0', name: 'All Districts' }];
        for (let i = 1; i <= state.districtsCount; i++) {
            districts.push({ id: `${state.id}_District${i}`, name: `District ${i}` });
        }
        return districts;
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5px', padding: '10px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Filters</h2>
                
                {this.filterOptions.map((filter, index) => (
                    <div key={index} style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <select
                            id={`select-${index}`}
                            className="select-width"
                            value={filter.name === 'Select State' ? this.state.selectedState : filter.name === 'Select District' ? this.state.selectedDistrict : this.state.selectedTrend}
                            onChange={filter.name === 'Select State' ? this.handleStateChange : filter.name === 'Select District' ? this.handleDistrictChange : this.handleTrendChange}
                            disabled={filter.name !== 'Select State' && !this.state.selectedState}
                        >
                            <option value="" disabled>{filter.name}</option>
                            {filter.name === 'Select District' ? (
                                this.getDistrictOptions().map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))
                            ) : (
                                filter.options.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                ))}
                
                <button onClick={this.handleResetFilters} style={{ backgroundColor: colors.demoBlue, borderRadius: '5px', color: '#fff', border: 'none', padding: '10px 15px', cursor: 'pointer' }}>
                    Reset Filters
                </button>
            </div>
        );
    }
}

export default Sidebar;
