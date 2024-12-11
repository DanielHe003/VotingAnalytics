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
            { id: "ComparePlans", name: "Compare Plans" },
          ],
        },
      ],
      selectedState: "",
      selectedTrend: "",
      selectedSubOption: "",
    };
  }

  handleChange = (type) => (event) => {
    const value = event.target.value;
    this.setState({
      [`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
    });
    this.props[`setSelected${type.charAt(0).toUpperCase() + type.slice(1)}`](
      value
    );

    if (type === "trend" && value !== "Gingles") {
      this.setState({ selectedSubOption: "" });
    }
  };

  handleResetFilters = () => {
    this.setState({
      selectedState: "",
      selectedTrend: "",
      selectedSubOption: "",
      selectedSubSubOption: "",
    });
    this.props.setSelectedState("");
    this.props.setSelectedTrend("");
    this.props.setSelectedSubTrend("");
    this.props.setSelectedSubSubTrend("");
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

          {/* MCMC */}
          {this.props.selectedTrend === "MCMC" && (
            <FilterDropdown
              key="ginglesSubOptions"
              number={2}
              label="Select Sub-Option"
              name="Select Option"
              options={[]}
              value={this.props.selectedSubTrend || ""}
              onChange={this.handleChange("SubTrend")}
            />
          )}

          {/* Gingles */}
          {this.props.selectedTrend === "Gingles" && (
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
          )}

          {this.props.selectedSubTrend === "race" && (
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
          )}

          {this.props.selectedSubTrend === "income" && (
            <FilterDropdown
              key="raceSubOptions"
              number={3}
              label="Select Region Type"
              name="Select Option"
              options={[
                { id: "urban", name: "Urban" },
                { id: "suburban", name: "Suburban" },
                { id: "rural", name: "Rural" },
              ]}
              value={this.props.selectedSubSubTrend || ""}
              onChange={(e) =>
                this.props.setSelectedSubSubTrend(e.target.value)
              }
            />
          )}

          {this.props.selectedSubTrend === "income-race" && (
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
              onChange={(e) =>
                this.props.setSelectedSubSubTrend(e.target.value)
              }
            />
          )}

          {/* EI  */}
          {this.props.selectedTrend === "EI" && (
            <FilterDropdown
              key="ginglesSubOptions"
              number={2}
              label="Select Sub-Option"
              name="Select Option"
              options={[
                { id: "racial", name: "Racial" },
                { id: "economic", name: "Economic Group" },
                { id: "region", name: "Region" },
              ]}
              value={this.props.selectedSubTrend || ""}
              onChange={this.handleChange("SubTrend")}
            />
          )}

          {this.props.selectedSubTrend === "racial" && (
            <FilterDropdown
              key="raceSubOptions"
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
          )}

          {this.props.selectedSubTrend === "economic" && (
            <FilterDropdown
              key="raceSubOptions"
              number={3}
              label="Select Ethnic Group"
              name="Select Option"
              options={
                [
                  // add
                ]
              }
              value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          )}

          {this.props.selectedSubTrend === "region" && (
            <FilterDropdown
              key="raceSubOptions"
              number={3}
              label="Select Region Type"
              name="Select Option"
              options={[
                { id: "urban", name: "Urban" },
                { id: "suburban", name: "Suburban" },
                { id: "rural", name: "Rural" },
              ]}
              value={this.props.selectedSubSubTrend || ""}
              onChange={this.handleChange("SubSubTrend")}
            />
          )}

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
