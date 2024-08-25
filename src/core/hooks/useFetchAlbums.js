import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums, setCurrentPage, resetAlbums } from '../../core/store/albumsSlice';
import { debounce } from 'lodash';

export const useFetchAlbums = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const hasMoreAlbums = useSelector(state => state.albums.hasMoreAlbums);

  // Мемоизируем debounced функцию для избежания создания новой функции на каждом рендере
  const debouncedFetchAlbums = useCallback(
    debounce((searchTerm, genre, year, formats) => {
      console.log('Fetching albums with params:', { searchTerm, genre, year, formats });
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
    return () => {
      debouncedFetchAlbums.cancel();
    };
  }, [debouncedFetchAlbums]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && status !== 'loading' && hasMoreAlbums) {
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchAlbums({ 
          page: currentPage + 1, 
          perPage: albumsPerPage, 
          searchTerm: '',
          genre: null, 
          year: null, 
          formats: []
        }));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, status, currentPage, albumsPerPage, hasMoreAlbums]);

  return debouncedFetchAlbums;
};
