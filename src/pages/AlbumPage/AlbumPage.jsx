import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUser } from '../../core/store/userSlice';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { deleteAlbum } from '../../core/store/albumsSlice';
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
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .maybeSingle();

      if (error) {
        throw new Error('Error fetching album');
      } else {
        if (typeof data.genre === 'string') {
          data.genre = JSON.parse(data.genre);
        }
        if (typeof data.format === 'string') {
          data.format = JSON.parse(data.format);
        }
        setAlbum(data);
        setLoadingState('loaded');
        console.log("Fetched album:", data);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user && albumId) {
        const { data } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('album_id', albumId)
          .maybeSingle();

        if (data) {
          setIsFavorite(true);
        }
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
            .maybeSingle();

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
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('title, artist, image')
        .eq('id', albumId)
        .maybeSingle();

      if (albumError) {
        console.error('Error fetching album details:', albumError);
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([{ 
          user_id: user.id, 
          album_id: albumId,
          title: albumData.title,
          artist: albumData.artist,
          image: albumData.image
        }]);

      if (error) {
        console.error('Error adding to favorites:', error);
      } else {
        setIsFavorite(true);
        toast.success('Added to favorites!');
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

