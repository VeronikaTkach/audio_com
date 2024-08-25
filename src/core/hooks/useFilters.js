import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../core/store/albumsSlice';

export const useFilters = (debouncedFetchAlbums, searchTerm) => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([]);

  // Используем useCallback для мемоизации функций и предотвращения бесконечных циклов рендеров
  const handleGenreChange = useCallback((selectedOption) => {
    setSelectedGenre(selectedOption);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedOption?.value, selectedYear?.value, selectedFormats.map(f => f.value));
  }, [dispatch, searchTerm, selectedYear, selectedFormats, debouncedFetchAlbums]);

  const handleYearChange = useCallback((selectedOption) => {
    setSelectedYear(selectedOption);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedOption?.value, selectedFormats.map(f => f.value));
  }, [dispatch, searchTerm, selectedGenre, selectedFormats, debouncedFetchAlbums]);

  const handleFormatChange = useCallback((selectedOptions) => {
    setSelectedFormats(selectedOptions || []);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedYear?.value, (selectedOptions || []).map(f => f.value));
  }, [dispatch, searchTerm, selectedGenre, selectedYear, debouncedFetchAlbums]);

  const resetAllFilters = useCallback(() => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedFormats([]);
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums('', null, null, []);
  }, [dispatch, debouncedFetchAlbums]);

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
