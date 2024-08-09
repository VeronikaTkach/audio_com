import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../../core/store/genresSlice';
import { fetchYears } from '../../../core/store/yearsSlice';
import CreatableSelect from 'react-select/creatable';
import s from './styles.module.scss';

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: 38,
    minHeight: 38,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 38,
    minHeight: 38,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: 38,
    minHeight: 38,
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
  multiValue: (provided) => ({
    ...provided,
    height: 28,
    display: 'flex',
    alignItems: 'center',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#fff',
    color: '#252f3f',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#323233' : '#fff',
    color: state.isSelected ? '#fff' : '#252f3f',
    '&:hover': {
      backgroundColor: '#252f3f',
      color: '#fffcf2',
    }
  }),
};

export const Filters = ({ selectedGenre, handleGenreChange, selectedYear, handleYearChange, resetAllFilters }) => {
  const dispatch = useDispatch();
  const { genres, status: genreStatus } = useSelector(state => state.genres);
  const { years, status: yearStatus } = useSelector(state => state.years);

  useEffect(() => {
    if (genreStatus === 'idle') {
      dispatch(fetchGenres());
    }
    if (yearStatus === 'idle') {
      dispatch(fetchYears());
    }
  }, [genreStatus, yearStatus, dispatch]);

  if (genreStatus === 'loading' || yearStatus === 'loading') {
    return <div>Loading filters...</div>;
  }

  if (genreStatus === 'failed' || yearStatus === 'failed') {
    return <div>Error loading filters.</div>;
  }

  return (
    <div className={s.filters}>
      <div className={s.filterGroup}>
        <CreatableSelect
          value={selectedGenre}
          onChange={handleGenreChange}
          options={genres}
          className={s.dropdown}
          placeholder="Select genre..."
          styles={customStyles}
        />
        <div className={s.resetButtonWrapper}>
          <button 
            className={s.resetButton} 
            onClick={() => handleGenreChange(null)}
          ></button>
          <span className={s.resetButtonLabel}>Reset Genre</span>
        </div>
      </div>
      <div className={s.filterGroup}>
        <CreatableSelect
          value={selectedYear}
          onChange={handleYearChange}
          options={years}
          className={s.dropdown}
          placeholder="Select year..."
          styles={customStyles}
        />
        <div className={s.resetButtonWrapper}>
          <button 
            className={s.resetButton} 
            onClick={() => handleYearChange(null)}
          ></button>
          <span className={s.resetButtonLabel}>Reset Year</span>
        </div>
      </div>
      <div className={s.resetButtonWrapper}>
        <button 
          className={s.resetButton} 
          onClick={resetAllFilters}
        ></button>
        <span className={s.resetButtonLabel}>Reset All</span>
      </div>
    </div>
  );
};
