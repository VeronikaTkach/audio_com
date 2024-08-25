import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums, setCurrentPage } from '../../core/store/albumsSlice';
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
      console.log('Scroll event triggered');
      console.log('Window innerHeight + scrollY:', window.innerHeight + window.scrollY);
      console.log('Document body offsetHeight:', document.body.offsetHeight);
      console.log('Albums loading status:', status);
      console.log('Has more albums:', hasMoreAlbums);
  
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && status !== 'loading' && hasMoreAlbums) {
        console.log('Fetching more albums on scroll...');
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchAlbums({ 
          page: currentPage + 1, 
          perPage: albumsPerPage, 
          searchTerm: '', // Здесь можно передать текущие значения фильтров
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
