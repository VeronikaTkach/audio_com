import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGenres } from '../../../core/store/genresSlice';
import { fetchYears } from '../../../core/store/yearsSlice';
import { fetchFormats } from '../../../core/store/formatsSlice';
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

export const Filters = ({ selectedGenre, handleGenreChange, selectedYear, handleYearChange, selectedFormats, handleFormatChange, resetAllFilters }) => {
  const dispatch = useDispatch();
  const { genres, status: genreStatus } = useSelector(state => state.genres);
  const { years, status: yearStatus } = useSelector(state => state.years);
  const { formats, status: formatStatus } = useSelector(state => state.formats);

  useEffect(() => {
    if (genreStatus === 'idle') {
      dispatch(fetchGenres());
    }
    if (yearStatus === 'idle') {
      dispatch(fetchYears());
    }
    if (formatStatus === 'idle') {
      dispatch(fetchFormats());
    }
  }, [genreStatus, yearStatus, formatStatus, dispatch]);

  if (genreStatus === 'loading' || yearStatus === 'loading' || formatStatus === 'loading') {
    return <div>Loading filters...</div>;
  }

  if (genreStatus === 'failed' || yearStatus === 'failed' || formatStatus === 'failed') {
    return <div>Error loading filters.</div>;
  }

  return (
    <div className={s.filters}>
      <div className={s.filters__group}>
        <CreatableSelect
          // isMulti
          value={selectedGenre}
          onChange={handleGenreChange}
          options={genres}
          className={s.dropdown}
          placeholder="Select genre..."
          styles={customStyles}
        />
        <div className={s.reset__buttonWrapper}>
          <button 
            className={s.reset__button} 
            onClick={() => handleGenreChange(null)}
          ></button>
          <span className={s.reset__buttonLabel}>Reset Genre</span>
        </div>
      </div>
      <div className={s.filters__group}>
        <CreatableSelect
          value={selectedYear}
          onChange={handleYearChange}
          options={years}
          className={s.dropdown}
          placeholder="Select year..."
          styles={customStyles}
        />
        <div className={s.reset__buttonWrapper}>
          <button 
            className={s.reset__button} 
            onClick={() => handleYearChange(null)}
          ></button>
          <span className={s.reset__buttonLabel}>Reset Year</span>
        </div>
      </div>
      <div className={s.filters__group}>
        <CreatableSelect
          isMulti
          value={selectedFormats}
          onChange={handleFormatChange}
          options={formats}
          className={s.dropdown}
          placeholder="Select formats..."
          styles={customStyles}
        />
        <div className={s.reset__buttonWrapper}>
          <button 
            className={s.reset__button} 
            onClick={() => handleFormatChange([])}
          ></button>
          <span className={s.reset__buttonLabel}>Reset Formats</span>
        </div>
      </div>
      <div className={s.reset__buttonWrapper}>
        <span style={{width: '205px'}}/>
        <button 
          className={s.reset__button} 
          onClick={resetAllFilters}
        ></button>
        <span className={s.reset__buttonLabel}>Reset All</span>
      </div>
    </div>
  );
};
