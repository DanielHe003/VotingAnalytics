import React from "react";
import FilterDropdown from "../common/FilterDropdown";
import "./TopBar.css";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOptions: [
        {
          name: "Select State",
          options: [
            { id: "Alabama", name: "Alabama", districtsCount: 7 },
            { id: "California", name: "California", districtsCount: 52 },
          ],
        },
        {
          name: "Select Trend",
          options: [
            { id: "EI", name: "Ecological Inference" },
            { id: "Gingles", name: "Gingles 2/3 Analysis" },
            { id: "MCMC", name: "MCMC Analysis" },
          ],
        },
      ],
      selectedState: "",
      selectedTrend: "",
      selectedSubTrend: "",
      selectedSubSubTrend: "",
      selectedSubSubSubTrend: "",
    };
  }

  handleChange = (type) => (event) => {
    const value = event.target.value;
    this.setState(
      {
        [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
      },
      () => {
        this.props[
          `setSelected${type.charAt(0).toUpperCase() + type.slice(1)}`
        ](value);

        if (type === "trend") {
          this.setState({
            selectedSubTrend: "",
            selectedSubSubTrend: "",
          });
          this.props.setSelectedSubTrend("");
          this.props.setSelectedSubSubTrend("");
        } else if (type === "SubTrend") {
          this.setState({
            selectedSubSubTrend: "",
          });
          this.props.setSelectedSubSubTrend("");
        }
      }
    );
  };

  handleResetFilters = () => {
    this.setState({
      selectedState: "",
      selectedTrend: "",
      selectedSubTrend: "",
      selectedSubSubTrend: "",
    });
    this.props.setSelectedState("");
    this.props.setSelectedTrend("");
    this.props.setSelectedSubTrend("");
    this.props.setSelectedSubSubTrend("");
  };

  renderSubOptions = (trend) => {
    switch (trend) {
      case "Gingles":
        return (
          <FilterDropdown
            key="ginglesSubOptions"
            number={2}
            label="Select Sub-Option"
            name="Select Option"
            options={[
              { id: "race", name: "Race" },
              { id: "income", name: "Income" },
              { id: "income-race", name: "Income-Race" },
            ]}
            value={this.props.selectedSubTrend || ""}
            onChange={this.handleChange("SubTrend")}
          />
        );
      case "EI":
        return (
          <FilterDropdown
            key="EISubOptions"
            number={2}
            label="Select Sub-Option"
            name="Select Option"
            options={[
              { id: "racial", name: "Race" },
              { id: "economic", name: "Economic" },
              { id: "region", name: "Region" },
            ]}
            value={this.props.selectedSubTrend || ""}
            onChange={this.handleChange("SubTrend")}
          />
        );
        case "MCMC":
        return (
          <FilterDropdown
            key="MCMC Sub Options"
            number={2}
            label="Select Sub-Option"
            name="Select Option"
            options={[
              { id: "racial", name: "Racial" },
              { id: "economic", name: "Economic" },
              { id: "region", name: "Region" },
            ]}
            value={this.props.selectedSubTrend || ""}
            onChange={this.handleChange("SubTrend")}
          />
        );
      default:
        return null;
    }
  };

  renderSubSubOptions = (subTrend) => {
    if (subTrend) {
      switch (subTrend) {
        case "race":
          return (
            <FilterDropdown
              key="raceSubOptions"
              number={3}
              label="Select Ethnic Group"
              name="Select Option"
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
        case "income-race":
          return (
            <FilterDropdown
              key="incomeRaceSubOptions"
              number={3}
              label="Select Ethnic Group"
              name="Select Option"
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
        case "racial":
          return (
            <FilterDropdown
              key="raceSubOptions1"
              number={3}
              label="Select Ethnic Group"
              name="Select Option"
              options={[
                { id: "White", name: "White" },
                { id: "Black", name: "Black" },
                { id: "Hispanic", name: "Hispanic" },
                { id: "Asian", name: "Asian" },
              ]}
              value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          );
        case "economic":
          return (
            <FilterDropdown
              key="raceSubOption1s"
              number={3}
              label="Select Ethnic Group"
              name="Select Option"
              options={[
                { id: "low", name: "0k-35k" },
                { id: "low_middle", name: "35K-120K" },
                { id: "upper_middle", name: "60K-120K" },
                { id: "upper", name: "125K+" },
              ]}
              value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          );
          case "region":
          return (
            <FilterDropdown
              key="regionsuboptions1"
              number={3}
              label="Select Region Type"
              name="Select Option"
              options={[
                { id: "Urban", name: "Urban" },
                { id: "Suburban", name: "Suburban" },
                { id: "Rural", name: "Rural" },
              ]}
              value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
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
                this.state[`selected${filter.name.replace("Select ", "")}`] ||
                ""
              }
              onChange={this.handleChange(
                filter.name === "Select State" ? "state" : "trend"
              )}
              disabled={
                filter.name === "Select Trend" && !this.props.selectedState
              }
            />
          ))}

          {this.renderSubOptions(this.props.selectedTrend)}
          {this.renderSubSubOptions(this.props.selectedSubTrend)}


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
