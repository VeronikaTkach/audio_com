import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { addGenre } from '../../../core/store/genresSlice';
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
    alignItems: 'center'
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
};

export const GenreDropdown = ({ selectedGenres, handleGenreChange }) => {
  const dispatch = useDispatch();
  const genres = useSelector(state => state.genres.genres);

  const handleCreate = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    dispatch(addGenre(newOption));
  };

  return (
    <div className={s.container}>
      <CreatableSelect
        isMulti
        name="genres"
        options={genres}
        className={s.dropdown}
        classNamePrefix="select"
        onChange={handleGenreChange}
        onCreateOption={handleCreate}
        value={selectedGenres}
        placeholder="Select genres..."
        styles={customStyles}
      />
    </div>
  );
};

GenreDropdown.propTypes = {
  selectedGenres: PropTypes.array.isRequired,
  handleGenreChange: PropTypes.func.isRequired
};
