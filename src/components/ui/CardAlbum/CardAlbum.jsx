import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import s from './styles.module.scss';

export const CardAlbum = ({ albumId, onClose, canEdit }) => {
  const [album, setAlbum] = useState(null);
  
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
        setAlbum(data);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const handleDelete = async () => {
    await supabase
      .from('albums')
      .delete()
      .eq('id', albumId);
    onClose();
  };

  if (!album) return null;

  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <button className={s.modal__close} onClick={onClose}>&times;</button>
        <div className={s.modal__info}>
          <img src={album.image} alt={`${album.title} cover`} className={s.modal__album__image} />
          <span>{album.title}</span>
          <span>{album.artist}</span>
          <p><strong>Genre:</strong> {album.genre}</p>
          <p><strong>Release Date:</strong> {album.release_date}</p>
          <p><strong>Tracks:</strong> {album.value_of_tracks}</p>
          <p><strong>Description:</strong> {album.description}</p>
          <p><strong>Format:</strong> {album.format}</p>
          {canEdit && <button onClick={handleDelete} className={s.delete__button}>Delete</button>}
        </div>
      </div>
    </div>
  );
};
