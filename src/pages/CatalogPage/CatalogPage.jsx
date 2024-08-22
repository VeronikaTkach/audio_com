import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { fetchAlbums, setSearchTerm, setCurrentPage, deleteAlbum, resetAlbums } from '../../core/store/albumsSlice';
import { supabase } from '../../../supabaseClient';
import { SearchInput } from '../../components/ui/SearchInput';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Filters } from '../../components/ui/Filters';
import { Button } from '../../components/ui/Button';
import { AlbumItem } from '../../components/AlbumItem/AlbumItem';
import s from './styles.module.scss';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([]);

  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const hasMoreAlbums = useSelector(state => state.albums.hasMoreAlbums);
  const user = useSelector(state => state.user.user);

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
    debouncedFetchAlbums(searchTerm, selectedGenre?.value, selectedYear?.value, selectedFormats.map(f => f.value));
  }, [searchTerm, selectedGenre, selectedYear, selectedFormats, debouncedFetchAlbums]);

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


  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
    debouncedFetchAlbums(term, selectedGenre?.value, selectedYear?.value, selectedFormats.map(f => f.value)); // С задержкой обновляем список альбомов
  };

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

  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/album/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    setSelectedAlbumId(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
        await supabase
            .from('format_album')
            .delete()
            .eq('album_id', selectedAlbumId);

        await supabase
            .from('genre_album')
            .delete()
            .eq('album_id', selectedAlbumId);

        const { data: albumData, error: albumError } = await supabase
            .from('albums')
            .delete()
            .eq('id', selectedAlbumId)
            .select()
            .single();

        if (albumError) {
            throw new Error(albumError.message);
        }

        if (albumData.image) {
            const coverPath = `covers/${albumData.artist}/${albumData.title}`;
            const { error: storageError } = await supabase.storage
                .from('album_covers')
                .remove([coverPath]);

            if (storageError) {
                throw new Error(storageError.message);
            }
        }

        dispatch(deleteAlbum(selectedAlbumId));
        setShowConfirmDelete(false);
        setSelectedAlbumId(null);

        toast.success('Album deleted successfully!');

    } catch (error) {
        console.error('Error deleting album:', error.message);
        toast.error('Failed to delete album.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
  };

  const toggleFiltersPopup = () => {
    setShowFiltersPopup(prev => !prev);
  };

  return (
    <div className={s.container}>
      <h1>Albums</h1>
      <div className={s.container__header}>
        <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} onToggleFilters={toggleFiltersPopup} />
      </div>
      {showFiltersPopup && (
        <div className={s.filters__popup}>
          <div className={s.filters__popup__header}>
            <h2>Filters</h2>
            <Button label={'x'} className={s.filters__closePopupButton} onClick={toggleFiltersPopup}/>
          </div>
          <Filters
            selectedGenre={selectedGenre}
            handleGenreChange={handleGenreChange}
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            selectedFormats={selectedFormats}
            handleFormatChange={handleFormatChange}
            resetAllFilters={resetAllFilters}
          />
        </div>
      )}
      <div className={albums.length === 0 ? s.noalbumsfound__container : s.catalog__albums__list}>
          {albums.length === 0 ? (
            <div className={s.noalbumsfound__text}>Albums not found</div>
          ) : (
            albums.map(album => (
              <AlbumItem 
                key={album.id} 
                album={album} 
                onClick={handleAlbumClick} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
                isEditor={user && user.isEditor}
              />
            ))
          )}
      </div>
      {showConfirmDelete && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
