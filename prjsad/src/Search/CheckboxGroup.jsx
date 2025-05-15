import React from 'react';

export default function CheckboxGroup({ title, options, selectedValues, onChange, name, gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{title}:</h4>
      <div className={`grid ${gridCols} gap-x-3 gap-y-1.5`}>
        {options.map(option => (
          <label key={option.id} className="flex items-center space-x-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option.id}
              checked={selectedValues.includes(option.id)}
              onChange={onChange}
              className="form-checkbox h-3.5 w-3.5 text-sky-600 border-gray-300 rounded focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-sky-500 dark:focus:ring-offset-gray-800"
            />
            <span className="text-gray-700 dark:text-gray-200">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}