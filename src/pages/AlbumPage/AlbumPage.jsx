import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../core/store/userSlice';
import { supabase } from '../../../supabaseClient';
import { Button } from '../../components/ui/Button';
import { EditAlbumButton, DeleteAlbumButton } from '../../components/ui/Button';
import s from './styles.module.scss';

export const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Состояние для отслеживания удаления
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const fetchAlbum = async () => {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', albumId)
      .single();

    if (error || !data) {
      console.error('Error fetching album or album not found:', error);
      setIsDeleted(true); // Устанавливаем состояние, если альбом не найден или произошла ошибка
    } else {
      if (typeof data.genre === 'string') {
        data.genre = JSON.parse(data.genre);
      }
      if (typeof data.format === 'string') {
        data.format = JSON.parse(data.format);
      }
      setAlbum(data);
    }
  };

  useEffect(() => {
    if (albumId && !isDeleted) {
      fetchAlbum();
    }
  }, [albumId, isDeleted]);

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

  const handleDeleteAlbum = async (id) => {
    console.log(`Album ${id} deleted`);
    setIsDeleted(true); // Устанавливаем состояние как удаленное

    // Повторная загрузка данных после удаления для обновления UI
    await fetchAlbum();
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

  const handleNavigateToCatalog = () => {
    navigate('/catalog');
  };

  const handleNavigateToNewAlbum = () => {
    navigate('/album/new');
  };

  // Если альбом был удален, показываем сообщение и кнопки навигации
  if (isDeleted) {
    return (
      <div className={s.album__deleted}>
        <h2>Album deleted!</h2>
        <div className={s.album__actions}>
          <Button label="Create New Album" onClick={handleNavigateToNewAlbum} />
          <Button label="Catalog" onClick={handleNavigateToCatalog} />
        </div>
      </div>
    );
  }

  // Если альбом еще загружается
  if (!album) return <div>Loading...</div>;

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
              <EditAlbumButton 
                albumId={albumId} 
                onEdit={handleEditClick} 
                className={s.album__button} 
              />
              <DeleteAlbumButton 
                albumId={albumId} 
                onDelete={handleDeleteAlbum} 
                className={s.album__button} 
              />
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
    </div>
  );
};
