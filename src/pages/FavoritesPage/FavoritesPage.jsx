import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { ConfirmDeleteModal } from '../../components/ui/ConfirmDeleteModal';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const user = useSelector((state) => state.user.user);
  
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
          setFavorites(data);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', deleteItemId)
        .eq('user_id', user.id);
      setFavorites(favorites.filter(fav => fav.id !== deleteItemId));
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
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id);
      setFavorites([]);
      setShowDeleteModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error('Error deleting all favorites:', error);
    }
  };

  return (
    <div className={s.favorites__page}>
      <h2>Your Favorites</h2>
      {favorites.length > 0 ? (
        <table className={s.favorites__table}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.id}>
                <td>
                  <img src={fav.image} alt={`${fav.title} cover`} className={s.favorites__image} />
                </td>
                <td>{fav.title}</td>
                <td>{fav.artist}</td>
                <td>
                  <button onClick={() => handleDeleteClick(fav.id)} className={s.delete__button}>
                    &#10005;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No favorites found.</p>
      )}
      <div className={s.delete_all}>
        <button onClick={handleDeleteAllClick} className={s.delete_all__button}>
          Delete All
        </button>
      </div>
      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={deleteItemId === 'all' ? handleConfirmDeleteAll : handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
