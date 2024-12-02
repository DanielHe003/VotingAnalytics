import React from 'react';
import FilterDropdown from '../common/FilterDropdown';
import "./TopBar.css";

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: [
                {
                    name: 'Select State',
                    options: [
                        { id: 'Alabama', name: 'Alabama', districtsCount: 7 },
                        { id: 'California', name: 'California', districtsCount: 52 },
                    ],
                },
                {
                    name: 'Select Trend',
                    options: [
                        { id: 'EI', name: 'Ecological Inference' },
                        { id: 'Gingles', name: 'Gingles 2/3 Analysis' },
                        { id: 'MCMC', name: 'MCMC Analysis' },
                    ],
                },
            ],
            selectedState: "",
            selectedTrend: "",
        };
    }

    handleChange = (type) => (event) => {
        const value = event.target.value;
        this.setState({
            [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
        });
        this.props[`setSelected${type.charAt(0).toUpperCase() + type.slice(1)}`](value);
    };

    handleResetFilters = () => {
        this.setState({
            selectedState: "",
            selectedTrend: "",
        });
        this.props.setSelectedState("");
        this.props.setSelectedTrend("");
    };

    render() {
        return (
            <div className="top-bar-container">
                <div className="filters-container">
                    {this.state.filterOptions.map((filter, index) => (
                        <FilterDropdown
                            key={index}
                            number={index}
                            label={filter.name}
                            options={filter.options}
                            value={
                                this.state[
                                    `selected${filter.name
                                        .replace("Select ", "")
                                    }`] || ""
                            }
                            onChange={this.handleChange(
                                filter.name === "Select State"
                                    ? "state"
                                    : "trend"
                            )}
                            disabled={
                                filter.name === "Select Trend" && !this.props.selectedState
                            }
                        />
                    ))}
                    <button
                        onClick={this.handleResetFilters}
                        className="reset-filters-button"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        );
    }
}

export default TopBar;
