import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import s from './styles.module.scss';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*');

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites(data);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className={s.favorites__page}>
      <h2>Your Favorites</h2>
      {favorites.length > 0 ? (
        <table className={s.favorites__table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {favorites.map((fav) => (
              <tr key={fav.id}>
                <td>{fav.id}</td>
                <td>{fav.title}</td>
                <td>{fav.artist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No favorites found.</p>
      )}
    </div>
  );
};
