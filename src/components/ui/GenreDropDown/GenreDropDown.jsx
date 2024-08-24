import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { saveGenreToSupabase } from '../../../core/store/genresSlice';
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

export const GenreDropdown = ({ selectedGenres, handleGenreChange, options, setOptions }) => {
  const dispatch = useDispatch();

  const handleCreate = async (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };

    try {
      const result = await dispatch(saveGenreToSupabase(newOption)).unwrap();

      setOptions((prevOptions) => {
        const updatedOptions = [...prevOptions, newOption];
        return updatedOptions;
      });

    } catch (error) {
      console.error('Ошибка при добавлении нового жанра:', error);
    }
  };

  const handleGenreChangeInternal = (selectedOptions) => {
  
    if (!selectedOptions || selectedOptions.length === 0) {
      handleGenreChange([]);
      return;
    }

    const filteredOptions = selectedOptions.filter(option => option && typeof option.value === 'string');
    handleGenreChange(filteredOptions);
  };

  return (
    <div className={s.container}>
      <CreatableSelect
        isMulti
        name="genres"
        options={options}
        className={s.dropdown}
        classNamePrefix="select"
        onChange={handleGenreChangeInternal}
        onCreateOption={handleCreate}
        value={selectedGenres}
        placeholder="Select genres..."
        styles={customStyles}
        isClearable
      />
    </div>
  );
};

GenreDropdown.propTypes = {
  selectedGenres: PropTypes.array.isRequired,
  handleGenreChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  setOptions: PropTypes.func.isRequired,
};
