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
  
  availablePlans = [
    {
      name: "Alabama",
      options: [
        { id: "enacted", name: "Current Plan" },
        { id: "maxIncomeDeviation1", name: "Max Income Deviation 1" },
        { id: "maxIncomeDeviation2", name: "Max Income Deviation 2" },
        { id: "minIncomeDeviation1", name: "Min Income Deviation 1" },
        { id: "minIncomeDeviation2", name: "Min Income Deviation 2" },
        { id: "heavilyRural1", name: "Heavily Rural 1" },
        { id: "heavilyRural2", name: "Heavily Rural 2" },
        { id: "heavilyRural3", name: "Heavily Rural 3" }
      ]
    },
    {
      name: "California",
      options: [
        { id: "enacted", name: "Current Plan" },
        { id: "maxIncomeDeviation1", name: "Max Income Deviation 1" },
        { id: "maxIncomeDeviation2", name: "Max Income Deviation 2" },
        { id: "minIncomeDeviation1", name: "Min Income Deviation 1" },
        { id: "minIncomeDeviation2", name: "Min Income Deviation 2" },
        { id: "heavilyRural1", name: "Heavily Rural 1" },
        { id: "heavilyRural2", name: "Heavily Rural 2" },
        { id: "heavilyRural3", name: "Heavily Rural 3" },
        { id: "heavilyRural4", name: "Heavily Rural 4" },
        { id: "heavilyUrban1", name: "Heavily Urban 1" },
        { id: "heavilyUrban2", name: "Heavily Urban 2" },
        { id: "heavilyUrban3", name: "Heavily Urban 3" },
        { id: "heavilyUrban4", name: "Heavily Urban 4" },
        { id: "heavilySuburban1", name: "Heavily Suburban 1" },
        { id: "heavilySuburban2", name: "Heavily Suburban 2" },
        { id: "heavilySuburban3", name: "Heavily Suburban 3" },
        { id: "heavilySuburban4", name: "Heavily Suburban 4" }
      ]
    }
  ];  

  filterOptions = [
    {
      name: "Select State",
      options: [
        { id: "Alabama", name: "Alabama", districtsCount: 7 },
        { id: "California", name: "California", districtsCount: 53 },
      ],
    },
    { name: "Select District" },
    {
      name: "Select Trend",
      options: [
        { id: "voting", name: "Voting Distribution" },
        { id: "race", name: "Population by Race" },
        { id: "region", name: "Population (Region)" },
        { id: "income", name: "Income Distribution" },
        { id: "rep", name: "State Representatives" },
        { id: "precinct", name: "Precinct Analysis" },
        { id: 'ComparePlans', name: 'Compare Plans' },
      ],
    },
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

  render() {
    return (
      <div className="top-bar-container">
        <div className="filters-container">
          
        {
   true && (
    <FilterDropdown
      key={0}
      number={0}
      label="Select State"
      options={this.filterOptions[0].options}
      value={this.state.selectedState || ""}
      onChange={this.handleChange("state")}
    />
  )
}

{
  (
    <FilterDropdown
      key={1}
      number={1}
      label="Select District"
      options={this.getDistrictOptions()}
      value={this.state.selectedDistrict || ""}
      onChange={this.handleChange("district")}
      disabled={!this.state.selectedState}
    />
  )
}

{
  this.state.selectedState && (
    <FilterDropdown
      key={2}
      number={2}
      label="Select Trend"
      options={this.filterOptions[2].options}
      value={this.state.selectedTrend || ""}
      onChange={this.handleChange("trend")}
    />
  )
}

{/* COmpare plans ------ */}

      {this.props.selectedTrend === "ComparePlans" && (
            <FilterDropdown
              number={3}
              label="Choose Plan 1"
              options={this.availablePlans[this.props.selectedState === "Alabama" ? 0 : 1].options}
              onChange={this.handleChange("SubTrend")}
            />
          )}

        {this.props.selectedTrend === "ComparePlans" && (
            <FilterDropdown
              number={4}
              label="Choose Plan 2"
              options={this.availablePlans[this.props.selectedState === "Alabama" ? 0 : 1].options}
               value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          )}

























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
          {/* Demographics DropDown */}
          {this.props.selectedSubTrend === "demographic" && (

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
          )}

          <button
            onClick={this.handleResetFilters}
            className="reset-filters-button">
            Reset Filters
          </button>
        </div>
      </div>
    );
  }
}

export default TopBar;