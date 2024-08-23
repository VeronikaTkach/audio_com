import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../core/store/albumsSlice';

export const useFilters = (debouncedFetchAlbums, searchTerm) => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([]);

  const handleGenreChange = (selectedOption) => {
    setSelectedGenre(selectedOption);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedOption?.value, selectedYear?.value, selectedFormats.map(f => f.value));
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedOption?.value, selectedFormats.map(f => f.value));
  };

  const handleFormatChange = (selectedOptions) => {
    setSelectedFormats(selectedOptions || []);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedYear?.value, (selectedOptions || []).map(f => f.value));
  };

  const resetAllFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedFormats([]);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums('', null, null, []);
  };

  return {
    selectedGenre,
    selectedYear,
    selectedFormats,
    handleGenreChange,
    handleYearChange,
    handleFormatChange,
    resetAllFilters,
  };
};
