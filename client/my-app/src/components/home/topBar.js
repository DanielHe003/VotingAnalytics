import React from 'react';
// import './Sidebar.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircle } from '@fortawesome/free-solid-svg-icons';

const colors = {
    demoBlue: '#005BA6',
    demoGray: '#D6D6D6',
    demoPlaceholder: '#C7C7C7',
    demoBorder: '#E6E6E6',
};

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedState: '',
            selectedDistrict: '',
            selectedTrend: '',
        };

        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleDistrictChange = this.handleDistrictChange.bind(this);
        this.handleTrendChange = this.handleTrendChange.bind(this);
        this.handleResetFilters = this.handleResetFilters.bind(this);
    }

    filterOptions = [
        {
            name: 'Select State',
            options: [
                { id: 'Alabama', name: 'Alabama', districtsCount: 7 },
                { id: 'California', name: 'California', districtsCount: 52 },
            ],
        },
        {
            name: 'Select District',
        },
        {
            name: 'Select Trend',
            options: [
                { id: 'Precinct Analysis', name: 'Precinct Analysis' },
                { id: 'Ecological Inference', name: 'Ecological Inference' },
                { id: 'MCMC Analysis', name: 'MCMC' },
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
    }

    handleDistrictChange(event) {
        const selectedDistrict = event.target.value;
        this.setState({ 
            selectedDistrict: selectedDistrict,
        });
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
            districts.push({ id: `District ${String(i).padStart(2, '0')} Estimate`, name: `District ${String(i).padStart(2, '0')}` });
        }
        return districts;
    }

    render() {
        const spacing = '10px';
    
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5px', padding: '10px' }}>
                {this.filterOptions.map((filter, index) => (
                    <div key={index} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: colors.demoBlue,
                            color: '#fff',
                            textAlign: 'center',
                            lineHeight: '25px',
                            marginRight: '15px',
                            fontSize: '15px',
                            fontWeight: 'bold'
                        }}>
                            {index + 1}
                        </div>

                        <select
                            id={`select-${index}`}
                            className="select-width"
                            value={
                                filter.name === 'Select State' ? this.state.selectedState :
                                filter.name === 'Select District' ? this.state.selectedDistrict :
                                this.state.selectedTrend
                            }
                            onChange={
                                filter.name === 'Select State' ? this.handleStateChange :
                                filter.name === 'Select District' ? this.handleDistrictChange :
                                this.handleTrendChange
                            }
                            disabled={
                                (filter.name !== 'Select State' && !this.state.selectedState)
                            }
                        >
                            <option value="" disabled>{filter.name}</option>
                            {filter.name === 'Select State' ? (
                                filter.options.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))
                            ) : filter.name === 'Select District' ? (
                                this.getDistrictOptions().map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))
                            ) : filter.name === 'Select Trend' ? (
                                filter.options.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))
                            ) : null}
                        </select>
                    </div>
                ))}

                <button
                    onClick={this.handleResetFilters}
                    style={{
                        backgroundColor: colors.demoBlue,
                        borderRadius: '5px',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        marginTop: spacing
                    }}>
                    Reset Filters
                </button>
            </div>
        );
    }
}    

export default TopBar;
