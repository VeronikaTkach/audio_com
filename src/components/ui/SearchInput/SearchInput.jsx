import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

const SearchInput = ({ searchTerm, handleSearch }) => {
  return (
    <div className={s.catalog__search}>
      <input
        type="text"
        placeholder="Search albums..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className={s.catalog__search__input}
      />
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchInput;
