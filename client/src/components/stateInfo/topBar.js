import React from "react";
import FilterDropdown from "../common/FilterDropdown";
import "./TopBar.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedState: "",
      selectedDistrict: "",
      selectedTrend: "",
      selectedSubTrend: "",
      analysisOptionsAdded: false,
    };
  }

  filterOptions = [
    {
      name: "Select State",
      options: [
        { id: "Alabama", name: "Alabama", districtsCount: 7 },
        { id: "California", name: "California", districtsCount: 53 },
      ],
    },
    { name: "Select District" },

  ];

  handleChange = (type) => (event) => {
    const value = event.target.value;
    const reset =
      type === "state" || type === "trend" ? { selectedSubTrend: "" } : {};
    this.setState({
      [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      ...reset,
    });
    this.props[`setSelected${type.charAt(0).toUpperCase() + type.slice(1)}`](
      value
    );
  };

  handleResetFilters = () => {
    this.setState({
      selectedState: "",
      selectedDistrict: "",
      selectedTrend: "",
      selectedSubTrend: "",
      analysisOptionsAdded: false,
    });
    this.props.setSelectedState("");
    this.props.setSelectedDistrict("");
    this.props.setSelectedTrend("");
    this.props.setSelectedSubTrend("");
    this.props.setSelectedSubSubTrend("");
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedState !== this.props.selectedState) {
      this.setState({ selectedState: this.props.selectedState });
      this.props.setSelectedDistrict("All Districts");
      this.props.setSelectedTrend("");
      this.props.setSelectedSubTrend("");
      this.props.setSelectedSubSubTrend("");
    }
    if (prevProps.selectedDistrict !== this.props.selectedDistrict) {
      this.setState({ selectedDistrict: this.props.selectedDistrict });
    }

    if (prevProps.selectedTrend !== this.props.selectedTrend) {
      this.setState({ selectedTrend: this.props.selectedTrend });
    }

    if (prevProps.selectedSubTrend !== this.props.selectedSubTrend) {
      this.setState({ selectedSubTrend: this.props.selectedSubTrend });
    }
  }

  getDistrictOptions() {
    if (!this.state.selectedState) return [];
    const state = this.filterOptions[0].options.find(
      (option) => option.id === this.state.selectedState
    );
    const districts = [{ id: "0", name: "All Districts" }];
    for (let i = 1; i <= state.districtsCount; i++) {
      districts.push({
        id: `District ${String(i).padStart(2, "0")}`,
        name: `District ${String(i).padStart(2, "0")}`,
      });
    }
    return districts;
  }

  renderSubOptions() {
    if (this.props.selectedDistrict === "All Districts") {
      return (
        <FilterDropdown
          number={2}
          label="Select Trend"
          options={ [
              { id: "voting", name: "Voting Distribution" },
              { id: "race", name: "Population by Race" },
              { id: "region", name: "Population (Region)" },
              { id: "income", name: "Income Distribution" },
              { id: "precinct", name: "Precinct Analysis" },
            ]
          }
          value={this.props.selectedSubTrend || ""}
          onChange={this.handleChange("SubTrend")}
        />
      );
    }
    return null;
  }

  renderSubSubOptions() {
    if (this.props.selectedSubTrend === "demographic") {
      return (
        <FilterDropdown
          number={4}
          label="Select Ethnic Group"
          options={[
            { id: "white", name: "White" },
            { id: "black", name: "Black" },
            { id: "hispanic", name: "Hispanic" },
            { id: "asian", name: "Asian" },
          ]}
          value={this.props.selectedSubSubTrend || ""}
          onChange={this.handleChange("SubSubTrend")}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="top-bar-container">
        <div className="filters-container">
          {true && (
            <FilterDropdown
              key={0}
              number={0}
              label="Select State"
              options={this.filterOptions[0].options}
              value={this.state.selectedState || ""}
              onChange={this.handleChange("state")}
            />
          )}

          {
            <FilterDropdown
              key={1}
              number={1}
              label="Select District"
              options={this.getDistrictOptions()}
              value={this.state.selectedDistrict || ""}
              onChange={this.handleChange("district")}
              disabled={!this.state.selectedState}
            />
          }

      

          {/* Precinct Dropdown */}
          {this.props.selectedTrend === "precinct" && (
            <FilterDropdown
              number={3}
              label="Chose Sub Trend"
              options={[
                { id: "demographic", name: "Demographic" },
                { id: "economic", name: "Economic" },
                { id: "region", name: "Region Type" },
                { id: "poverty", name: "Poverty Level" },
                { id: "pil", name: "Political-Income Level" },
              ]}
              value={this.props.selectedSubTrend || ""}
              onChange={this.handleChange("SubTrend")}
            />
          )}

          {this.renderSubOptions()}
          {this.renderSubSubOptions()}

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
