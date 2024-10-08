import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { supabase } from '../../../supabaseClient';
import { Button } from '../../components/ui/Button';
import { FaRegStar, FaStar } from 'react-icons/fa';
import s from './styles.module.scss';
import defaultCover from '../../assets/photo.png';

const AlbumImage = lazy(() => import('../../components/ui/AlbumImage/AlbumImage'));

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
          .maybeSingle();

        if (data) {
          setIsFavorite(true);
        }
      }
    };

    checkIfFavorite();
  }, [user, album.id]);

  const handleAddToFavorites = async () => {
    if (user) {
      if (isFavorite) {
        toast.success('The album has already been added to your favorites!');
        return;
      }

      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('title, artist, image')
        .eq('id', album.id)
        .single();

      if (albumError) {
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
        toast.success('The album has already been added to your favorites!');
      }
    }
  };

  return (
    <div className={s.album__item} onClick={() => onClick(album.id)}>
      <div className={s.album__info}>
        <Suspense fallback={<img src={defaultCover} alt="Default cover" className={s.album__image} />}>
          <AlbumImage src={album.image} alt={`${album.title} cover`} />
        </Suspense>
      </div>
      <div className={s.album__details}>
        <div className={s.album__artist}>{album.artist}</div>
        <div className={s.album__title}>{album.title}</div>
      </div>
      <div className={s.album__actions}>
        {user && (
          <div 
            className={s.favorite__icon} 
            onClick={(e) => { e.stopPropagation(); handleAddToFavorites(); }}
          >
            {isFavorite ? <FaStar size={24} color="gold" /> : <FaRegStar size={24} color="gold" />}
          </div>
        )}
        {isEditor && (
          <div className={s.album__actions}>
            <Button 
              label="Edit" 
              onClick={(e) => { e.stopPropagation(); onEdit(album.id); }} 
              className={s.album__button} 
            />
            <Button 
              label="Delete" 
              onClick={(e) => { e.stopPropagation(); onDelete(album.id); }} 
              className={s.album__button} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
