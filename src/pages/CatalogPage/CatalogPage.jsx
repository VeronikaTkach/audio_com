import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums, setSearchTerm, setCurrentPage, deleteAlbum } from '../../core/store/albumsSlice';
import { supabase } from '../../../supabaseClient';
import { SearchInput } from '../../components/ui/SearchInput';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import s from './styles.module.scss';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAlbums({ page: currentPage, perPage: albumsPerPage }));
    }
  }, [status, dispatch, currentPage, albumsPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && status !== 'loading') {
        dispatch(setCurrentPage(currentPage + 1));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, status, currentPage]);

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const filteredAlbums = albums.filter(album => {
    const searchWords = searchTerm.toLowerCase().split(' ');
    return searchWords.every(word =>
      album.title.toLowerCase().includes(word) ||
      album.artist.toLowerCase().includes(word)
    );
  });

  // const indexOfLastAlbum = currentPage * albumsPerPage;
  // const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  // const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  // const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

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
    await supabase
      .from('albums')
      .delete()
      .eq('id', selectedAlbumId);
    dispatch(deleteAlbum(selectedAlbumId));
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
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
      <div className={s.catalog__title}>Albums</div>
      <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
      {user && user.isEditor && (
        <button onClick={handleNewAlbumClick} className={s.catalog__button_new}>New Album</button>
      )}
      <div className={s.catalog__albums__list}>
        {filteredAlbums.map(album => (
          <div key={album.id} className={s.album__item} onClick={() => handleAlbumClick(album.id)}>
            <div className={s.album__info}>
              <div className={s.album__title} >{album.title}</div>
              <div className={s.album__artist}>{album.artist}</div>
            </div>
            {user && user.isEditor && (
              <div className={s.album__actions}>
                <button onClick={(e) => { e.stopPropagation(); handleEditClick(album.id); }} className={s.edit__button}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(album.id); }} className={s.delete__button}>Delete</button>
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
      {/* <div className={s.catalog__pagination}>
        {Array.from({ length: Math.ceil(filteredAlbums.length / albumsPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={s.page__button}>
              {i + 1}
            </button>
          ))}
      </div> */}   
    </div>
  )
}
