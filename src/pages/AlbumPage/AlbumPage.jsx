import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import s from './styles.module.scss';

export const AlbumPage = ({canEdit}) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const navigate = useNavigate();
  
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

  const handleDeleteClick= async () => {
    await supabase
      .from('albums')
      .delete()
      .eq('id', albumId);
    navigate('/catalog');
  };

  const handleEditClick = () => {
    navigate(`/album/edit/${albumId}`);
  };

  if (!album) return <div>Loading...</div>;

  return (
    <div className={s.album__page}>
      <button className={s.back__button} onClick={() => navigate('/catalog')}>Back to Catalog</button>
      <div className={s.album__info}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image} />
        <h2>{album.title}</h2>
        <h3>{album.artist}</h3>
        <p><strong>Genre:</strong> {album.genre}</p>
        <p><strong>Release Date:</strong> {album.release_date}</p>
        <p><strong>Tracks:</strong> {album.value_of_tracks}</p>
        <p><strong>Description:</strong> {album.description}</p>
        <p><strong>Format:</strong> {album.format}</p>
        {canEdit && <button onClick={handleEditClick} className={s.edit__button}>Edit</button>}
        {canEdit && <button onClick={handleDeleteClick} className={s.delete__button}>Delete</button>}
      </div>
    </div>
  );
};
