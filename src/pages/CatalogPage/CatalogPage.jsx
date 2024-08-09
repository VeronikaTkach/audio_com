import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums, setSearchTerm, setCurrentPage, deleteAlbum, resetAlbums } from '../../core/store/albumsSlice';
import { supabase } from '../../../supabaseClient';
import { SearchInput } from '../../components/ui/SearchInput';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Filters } from '../../components/ui/Filters';
import { Button } from '../../components/ui/Button';
import s from './styles.module.scss';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(resetAlbums());
    dispatch(fetchAlbums({ page: 1, perPage: albumsPerPage, searchTerm, genre: selectedGenre?.value, year: selectedYear?.value }));
  }, [dispatch, searchTerm, albumsPerPage, selectedGenre, selectedYear]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && status !== 'loading') {
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchAlbums({ page: currentPage + 1, perPage: albumsPerPage, searchTerm, genre: selectedGenre?.value, year: selectedYear?.value }));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, status, currentPage, albumsPerPage, searchTerm, selectedGenre, selectedYear]);

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleGenreChange = (selectedOption) => {
    setSelectedGenre(selectedOption);
    dispatch(resetAlbums());
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedOption?.value, 
      year: selectedYear?.value 
    }));
  };
  
  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
    dispatch(resetAlbums());
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedGenre?.value, 
      year: selectedOption?.value 
    }));
  };

  const resetAllFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    dispatch(resetAlbums());
    dispatch(fetchAlbums({ page: 1, perPage: albumsPerPage, searchTerm: '', genre: null, year: null }));
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

    } catch (error) {
      console.error('Error deleting album:', error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
  };

  const handleNewAlbumClick = () => {
    navigate('/album/new');
  };

  return (
    <div className={s.container}>
      <h1>Albums</h1>
      <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
      <Filters
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
        selectedYear={selectedYear}
        handleYearChange={handleYearChange}
        resetAllFilters={resetAllFilters} // Передаем функцию сброса всех фильтров
      />
      {user && user.isEditor && (
        <Button label="New Album" onClick={handleNewAlbumClick} />
      )}
      <div className={s.catalog__albums__list}>
        {albums.map(album => (
          <div key={album.id} className={s.album__item} onClick={() => handleAlbumClick(album.id)}>
            <div className={s.album__info}>
              <img src={album.image} alt={`${album.title} cover`} className={s.album__image} />
              <div className={s.album__details}>
                <div className={s.album__artist}>{album.artist}</div>
                <div className={s.album__title}>{album.title}</div>
              </div>
            </div>
            {user && user.isEditor && (
              <div className={s.album__actions}>
                <Button label="Edit" onClick={(e) => { e.stopPropagation(); handleEditClick(album.id); }} className={s.album__button} />
                <Button label="Delete" onClick={(e) => { e.stopPropagation(); handleDeleteClick(album.id); }} className={s.album__button} />
              </div>
            )}
          </div>
        ))}
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
