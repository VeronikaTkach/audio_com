import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../core/store/userSlice';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Button } from '../../components/ui/Button';
import { AlbumDetails } from '../../components/ui/AlbumDetails/AlbumDetails';
import { deleteAlbum } from '../../core/store/albumsSlice';
import s from './styles.module.scss';

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
        .single();

      if (error) {
        console.error('Error fetching album:', error);
      } else {
        if (typeof data.genre === 'string') {
          data.genre = JSON.parse(data.genre);
        }
        if (typeof data.format === 'string') {
          data.format = JSON.parse(data.format);
        }
        setAlbum(data);
        setLoadingState('loaded'); // Устанавливаем статус загрузки как "loaded"
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
          .single();

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
        setShowConfirmDelete(false); // Закрываем модальное окно
        setSelectedAlbumId(null);
        setLoadingState('deleted'); // Устанавливаем статус загрузки как "deleted"

        // Используем небольшой таймаут перед вызовом alert
        setTimeout(() => {
            alert('Album has been successfully deleted!');
            navigate('/catalog');
        }, 100); // 100 мс достаточно для завершения обновления состояния

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
        .single();

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
        alert('Added to favorites!');
      }
    }
  };

  if (!album) {
    if (loadingState === 'deleted') {
      return <div>Delete...</div>;
    }
    return <div>Loading...</div>;
  }

  return (
    <div className={s.album__page}>
      <div className={s.album__content}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image}/>
        <AlbumDetails 
          album={album} 
          user={user} 
          isFavorite={isFavorite} 
          onEditClick={handleEditClick} 
          onDeleteClick={() => handleDeleteClick(albumId)} 
          onAddToFavorites={handleAddToFavorites} 
        />
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
