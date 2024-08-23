import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';
import { Button } from '../../components/ui/Button';
import { AlbumItem } from '../../components/AlbumItem/AlbumItem';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 771);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
        } else {
          const updatedFavorites = data.map((fav) => {
            const imageUrl = fav.image || supabase.storage.from('album_covers').getPublicUrl(`covers/${fav.artist}/${fav.title}`).publicUrl;
            return {
              ...fav,
              image: imageUrl,
            };
          });
          setFavorites(updatedFavorites);
        }
      }
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 771);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', deleteItemId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting from favorites:', error);
      } else {
        // Удаление альбома из состояния favorites
        setFavorites(favorites.filter(fav => fav.id !== deleteItemId));
        // Проверка на успешное удаление из Supabase
        const { data: checkData, error: checkError } = await supabase
          .from('favorites')
          .select('*')
          .eq('id', deleteItemId)
          .eq('user_id', user.id);

        if (checkError) {
          console.error('Error checking deletion from favorites:', checkError);
        } else if (checkData.length === 0) {
          console.log('Album successfully deleted from favorites.');
        } else {
          console.error('Album was not deleted from favorites.');
        }
      }

      setShowDeleteModal(false);
      setDeleteItemId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
  };

  const handleDeleteAllClick = () => {
    setDeleteItemId('all');
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting all favorites:', error);
      } else {
        setFavorites([]);
      }

      setShowDeleteModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error('Error deleting all favorites:', error);
    }
  };

  const handleAlbumPageClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  return (
    <div className={s.favorites__page}>
      <h1>Your Favorites</h1>
      {favorites.length > 0 ? (
        <div className={s.favorites__list}>
          {favorites.map((fav) => (
            <div key={fav.id} className={s.favorites__item}>
              <AlbumItem 
                album={{ 
                  id: fav.album_id, 
                  title: fav.title, 
                  artist: fav.artist, 
                  image: fav.image 
                }} 
                onClick={() => handleAlbumPageClick(fav.album_id)}
              />
              <Button 
                label={isMobile ? 'x' : 'Remove from Favorites'} 
                onClick={() => handleDeleteClick(fav.id)} 
                className={s.remove__button}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No favorites found.</p>
      )}
      {favorites.length > 0 && (
        <div className={s.removeAll}>
          <Button label={'Remove All'} onClick={handleDeleteAllClick} className={s.remove_all__button}/>
        </div>
      )}
      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={deleteItemId === 'all' ? handleConfirmDeleteAll : handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
