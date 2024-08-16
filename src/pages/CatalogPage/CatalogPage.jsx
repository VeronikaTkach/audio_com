import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums, setSearchTerm, setCurrentPage } from '../../core/store/albumsSlice'; // Убрали resetAlbums и deleteAlbum
import { SearchInput } from '../../components/ui/SearchInput';
import { Filters } from '../../components/ui/Filters';
import { Button } from '../../components/ui/Button';
import { AlbumItem } from '../../components/AlbumItem/AlbumItem';
import s from './styles.module.scss';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState([]);

  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    console.log('Fetching new album list...');
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedGenre?.value, 
      year: selectedYear?.value, 
      formats: selectedFormats.map(f => f.value) 
    }));
  }, [dispatch, searchTerm, albumsPerPage, selectedGenre, selectedYear, selectedFormats]);

  const handleSearch = (term) => {
    console.log('Setting search term:', term);
    dispatch(setSearchTerm(term));
  };

  const handleGenreChange = (selectedOption) => {
    console.log('Selected genre:', selectedOption);
    setSelectedGenre(selectedOption);
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedOption?.value, 
      year: selectedYear?.value,
      formats: selectedFormats.map(f => f.value),
    }));
  };
  
  const handleYearChange = (selectedOption) => {
    console.log('Selected year:', selectedOption);
    setSelectedYear(selectedOption);
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedGenre?.value, 
      year: selectedOption?.value,
      formats: selectedFormats.map(f => f.value), 
    }));
  };

  const handleFormatChange = (selectedOptions) => {
    console.log('Selected formats:', selectedOptions);
    setSelectedFormats(selectedOptions || []);
    dispatch(fetchAlbums({ 
      page: 1, 
      perPage: albumsPerPage, 
      searchTerm, 
      genre: selectedGenre?.value, 
      year: selectedYear?.value,
      formats: (selectedOptions || []).map(f => f.value),
    }));
  };

  const resetAllFilters = () => {
    console.log('Resetting all filters...');
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedFormats([]);
    dispatch(fetchAlbums({ page: 1, perPage: albumsPerPage, searchTerm: '', genre: null, year: null, formats: [] }));
  };

  const handleAlbumClick = (id) => {
    console.log('Album clicked:', id);
    navigate(`/album/${id}`);
  };

  const handleEditClick = (id) => {
    console.log('Edit album:', id);
    navigate(`/album/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    console.log('Delete album click:', id);
    setSelectedAlbumId(id);
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    console.log('Cancel delete');
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
  };

  const handleNewAlbumClick = () => {
    console.log('Create new album');
    navigate('/album/new');
  };

  console.log('Rendering albums:', albums);

  return (
    <div className={s.container}>
      <h1>Albums</h1>
      <div className={s.container__header}>
        <Filters
          selectedGenre={selectedGenre}
          handleGenreChange={handleGenreChange}
          selectedYear={selectedYear}
          handleYearChange={handleYearChange}
          selectedFormats={selectedFormats}
          handleFormatChange={handleFormatChange}
          resetAllFilters={resetAllFilters}
        />
        <div className={s.container__actions}>
          <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
          {user && user.isEditor && (
            <Button label="Create New Album" onClick={handleNewAlbumClick} />
          )}
        </div>
      </div>
      <div className={s.catalog__albums__list}>
          {albums.map(album => (
            <AlbumItem 
              key={album.id} 
              album={album} 
              onClick={handleAlbumClick} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
              isEditor={user && user.isEditor}
            />
          ))}
      </div>
      {showConfirmDelete && (
        <ConfirmDeleteModal
          onConfirm={() => window.location.reload()} // Перезагружаем страницу после удаления
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
