import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchTerm } from '../../core/store/albumsSlice';
import { SearchInput } from '../../components/ui/SearchInput';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Filters } from '../../components/ui/Filters';
import { Button } from '../../components/ui/Button';
import { AlbumItem } from '../../components/AlbumItem/AlbumItem';
import s from './styles.module.scss';
import { useFetchAlbums } from '../../core/hooks/useFetchAlbums';
import { useFilters } from '../../core/hooks/useFilters';
import { useDeleteAlbum } from '../../core/hooks/useDeleteAlbum';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const user = useSelector(state => state.user.user);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);

  const {
    selectedGenre,
    selectedYear,
    selectedFormats,
    handleGenreChange,
    handleYearChange,
    handleFormatChange,
    resetAllFilters,
  } = useFilters();

  const debouncedFetchAlbums = useFetchAlbums(searchTerm, selectedGenre, selectedYear, selectedFormats);

  const {
    selectedAlbumId,
    showConfirmDelete,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteAlbum();

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
    debouncedFetchAlbums(term, selectedGenre?.value, selectedYear?.value, selectedFormats.map(f => f.value));
  };

  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`/album/edit/${id}`);
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
