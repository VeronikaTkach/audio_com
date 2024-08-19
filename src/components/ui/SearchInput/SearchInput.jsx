import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter } from 'react-icons/fa';
import s from './styles.module.scss';

export const SearchInput = ({ searchTerm, handleSearch, onToggleFilters }) => {
  return (
    <div className={s.catalog__searchContainer}>
      <FaSearch className={s.catalog__search__icon}/>
      <input
        type="text"
        placeholder="Search albums..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className={s.catalog__search}
      />
      <button className={s.catalog__filterButton} onClick={onToggleFilters}>
        <FaFilter />
      </button>
    </div>
  );
};

SearchInput.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
};
