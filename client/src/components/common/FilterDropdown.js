// FilterDropdown.js
import React from 'react';

const FilterDropdown = ({ number, label, options, value, onChange, disabled }) => {
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
};

export default FilterDropdown;
