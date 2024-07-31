import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../core/store/userSlice';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { Button } from '../../components/ui/Button/Button';
import s from './styles.module.scss';

export const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        const { data, error } = await supabase
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

  const handleDeleteClick = async () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    await supabase
      .from('albums')
      .delete()
      .eq('id', albumId);
    navigate('/catalog');
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
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

      const { data, error } = await supabase
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

  if (!album) return <div>Loading...</div>;

  console.log("Album image URL:", album.image);

  return (
    <div className={s.album__page}>
      <div className={s.album__content}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image}/>
        <div className={s.album__details}>
          <h2>{album.title}</h2>
          <h3>{album.artist}</h3>
          <p><strong>Genre: </strong>{album.genre.join(', ')}</p>
          <p><strong>Release Date:</strong> {album.release_date}</p>
          <p><strong>Tracks:</strong> {album.value_of_tracks}</p>
          <p><strong>Description:</strong> {album.description}</p>
          <p><strong>Format:</strong> {album.format.join(', ')}</p>
          {user && user.isEditor && (
            <div className={s.album__actions}>
              <Button label="Edit" onClick={handleEditClick}/>
              <Button label="Delete" onClick={handleDeleteClick}/>
            </div>
          )}
          {user && !user.isEditor && !isFavorite && (
            <Button label="Add to Favorites" onClick={handleAddToFavorites}/>
          )}
          {user && !user.isEditor && isFavorite && (
            <p>This album is already in your favorites.</p>
          )}
        </div>
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
