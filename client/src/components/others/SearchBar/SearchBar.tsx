import { AutoComplete } from 'antd';
import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './SearchBar.scss';

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const SearchBar = () => {
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSearch = (searchText: string) => {
    setOptions(
      !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onSelect = (data: string) => {
    console.log('onSelect', data);
  };

  return (
    <div className="search-bar">
      <SearchOutlined className="search-bar-icon" />
      <AutoComplete
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="Search here"
        allowClear
        className="search-bar-input"
      />
    </div>
  );
};

export default SearchBar;
