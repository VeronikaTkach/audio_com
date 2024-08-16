import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../../supabaseClient';
import { Button } from '../../components/ui/Button';
import { DeleteAlbumButton } from '../../components/ui/Button';
import { EditAlbumButton } from '../../components/ui/Button';
import s from './styles.module.scss';

export const AlbumItem = ({ album, onClick, onEdit, onDelete, isEditor }) => {
  const user = useSelector(state => state.user.user);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .eq('album_id', album.id)
          .single();

        if (data) {
          setIsFavorite(true);
        }
      }
    };

    checkIfFavorite();
  }, [user, album.id]);

  const handleAddToFavorites = async () => {
    if (user) {
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('title, artist, image')
        .eq('id', album.id)
        .single();

      if (albumError) {
        console.error('Error fetching album details:', albumError);
        return;
      }

      const { error } = await supabase
        .from('favorites')
        .insert([{ 
          user_id: user.id, 
          album_id: album.id,
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

  return (
    <div className={s.album__item} onClick={() => onClick(album.id)}>
      <div className={s.album__info}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image} />
      </div>
      <div className={s.album__details}>
        <div className={s.album__artist}>{album.artist}</div>
        <div className={s.album__title}>{album.title}</div>
      </div>
      {isEditor && (
        <div className={s.album__actions}>
          <EditAlbumButton 
            albumId={album.id}
            onEdit={onEdit}
            className={s.album__button}
          />
          <DeleteAlbumButton 
            albumId={album.id}
            onDelete={() => {
              onDelete(album.id); 
            }} 
            className={s.album__button} 
          />
        </div>
      )}
      {user && !user.isEditor && !isFavorite && (
        <Button label="Add to Favorites" onClick={(e) => { e.stopPropagation(); handleAddToFavorites(); }}/>
      )}
      {user && !user.isEditor && isFavorite && (
        <p>This album is already in <br/> your favorites.</p>
      )}
    </div>
  );
};
