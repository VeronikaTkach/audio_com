import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../core/store/userSlice';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import s from './styles.module.scss';

export const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
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
        setAlbum(data);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const handleDeleteClick= async () => {
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

  if (!album) return <div>Loading...</div>;

  return (
    <div className={s.album__page}>
      <div className={s.album__info}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image} />
        <h2>{album.title}</h2>
        <h3>{album.artist}</h3>
        <p><strong>Genre:</strong> {album.genre}</p>
        <p><strong>Release Date:</strong> {album.release_date}</p>
        <p><strong>Tracks:</strong> {album.value_of_tracks}</p>
        <p><strong>Description:</strong> {album.description}</p>
        <p><strong>Format:</strong> {album.format}</p>
        {user && user.isEditor && (
          <>
            <button onClick={handleEditClick} className={s.edit__button}>Edit</button>
            <button onClick={handleDeleteClick} className={s.delete__button}>Delete</button>
          </>
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
