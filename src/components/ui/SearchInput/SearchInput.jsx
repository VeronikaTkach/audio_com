import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const SearchInput = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search albums..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className={s.catalog__search}
      />
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
}
