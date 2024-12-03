import React from 'react';

class FilterDropdown extends React.Component {
    render() {
        const { number, label, options, value, onChange, disabled } = this.props;

        return (
            <div className="filter-dropdown">
                <div className="circle">{number + 1}</div>
                <select
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="select-width"
                >
                    <option value="" disabled>{label}</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

export default FilterDropdown;
