import React from 'react';

const SearchInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-2 border border-[#747373] rounded-md focus:outline-none text-sm"
  />
);

export default SearchInput;
