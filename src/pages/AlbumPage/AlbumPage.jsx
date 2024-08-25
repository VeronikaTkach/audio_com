import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUser } from '../../core/store/userSlice';
import { deleteAlbum } from '../../core/store/albumsSlice';
import { fetchAlbumApi, deleteAlbumApi, checkIfFavoriteApi, addAlbumToFavoritesApi } from '../../api';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import defaultCover from '../../assets/photo.png'
import s from './styles.module.scss';

const AlbumDetails = lazy(() => import('../../components/ui/AlbumDetails/AlbumDetails'))

export const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingState, setLoadingState] = useState('loading');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await fetchAlbumApi(albumId);
        setAlbum(albumData);
        setLoadingState('loaded');
        console.log("Fetched album:", albumData);
      } catch (error) {
        console.error(error);
        setLoadingState('error');
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user && albumId) {
        const isFav = await checkIfFavoriteApi(user.id, albumId);
        setIsFavorite(isFav);
      }
    };

    checkIfFavorite();
  }, [user, albumId]);

  const handleDeleteClick = async (id) => {
    setSelectedAlbumId(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAlbumApi(selectedAlbumId);
      dispatch(deleteAlbum(selectedAlbumId));
      setShowConfirmDelete(false);
      setSelectedAlbumId(null);
      setLoadingState('deleted');

      setTimeout(() => {
        toast.success('Album has been successfully deleted!');
        navigate('/catalog');
      }, 100);
    } catch (error) {
      console.error('Error deleting album:', error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
  };

  const handleEditClick = () => {
    navigate(`/album/edit/${albumId}`);
  };

  const handleAddToFavorites = async () => {
    if (user) {
      try {
        await addAlbumToFavoritesApi(user, albumId);
        setIsFavorite(true);
        toast.success('Added to favorites!');
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  if (loadingState === 'deleted') {
    return <div>Deleted...</div>;
  }

  return (
    <div className={s.album__page}>
      <div className={s.album__content}>
        <img 
          src={album?.image ? album.image : defaultCover} 
          alt={`${album?.title || 'Default'} cover`} 
          className={s.album__image}
        />
        {album ? (
          <Suspense fallback={<div>Loading album details...</div>}>
            <AlbumDetails 
              album={album} 
              user={user} 
              isFavorite={isFavorite} 
              onEditClick={handleEditClick} 
              onDeleteClick={() => handleDeleteClick(albumId)} 
              onAddToFavorites={handleAddToFavorites} 
            />
          </Suspense>
        ) : (
          <div>Loading...</div>
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
