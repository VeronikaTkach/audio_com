import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums, setCurrentPage, resetAlbums } from '../../core/store/albumsSlice';
import { debounce } from 'lodash';

export const useFetchAlbums = (searchTerm, selectedGenre, selectedYear, selectedFormats) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const hasMoreAlbums = useSelector(state => state.albums.hasMoreAlbums);

  const debouncedFetchAlbums = useCallback(
    debounce((searchTerm, genre, year, formats) => {
      dispatch(resetAlbums());
      dispatch(fetchAlbums({ 
        page: 1, 
        perPage: albumsPerPage, 
        searchTerm, 
        genre, 
        year, 
        formats 
      }));
    }, 300),
    [dispatch, albumsPerPage]
  );

  useEffect(() => {
    dispatch(resetAlbums());
    dispatch(setCurrentPage(1));
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedYear?.value, selectedFormats.map(f => f.value));
  }, [dispatch, debouncedFetchAlbums, searchTerm, selectedGenre, selectedYear, selectedFormats]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && status !== 'loading' && hasMoreAlbums) {
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchAlbums({ 
          page: currentPage + 1, 
          perPage: albumsPerPage, 
          searchTerm, 
          genre: selectedGenre?.value, 
          year: selectedYear?.value, 
          formats: selectedFormats.map(f => f.value)
        }));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, status, currentPage, albumsPerPage, searchTerm, selectedGenre, selectedYear, selectedFormats, hasMoreAlbums]);

  return debouncedFetchAlbums;
};
