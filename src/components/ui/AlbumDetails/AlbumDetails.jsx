import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../ui/Button';
import s from '../../../pages/AlbumPage/styles.module.scss';
import { FaRegStar, FaStar } from 'react-icons/fa';

const AlbumDetails = ({ album, user, isFavorite, onEditClick, onDeleteClick, onAddToFavorites }) => {
  const handleAddToFavoritesClick = () => {
    if (isFavorite) {
      toast.success('Album is already added in Favorites!');
      return;
    }
    onAddToFavorites();
  };
  
  return (
    <div className={s.album__details}>
      <div className={s.album__fav}>
        <h1>{album.title}</h1>
        {user && (
        <div className={s.favorite__icon} onClick={handleAddToFavoritesClick}>
          {isFavorite ? <FaStar size={36} color="gold" /> : <FaRegStar size={36} color="gold" />}
        </div>
      )}
      </div>
      <h2>{album.artist}</h2>
      <p><strong>Genre: </strong>{album.genre.join(', ')}</p>
      <p><strong>Release Date:</strong> {album.release_date}</p>
      <p><strong>Tracks:</strong> {album.value_of_tracks}</p>
      <p><strong>Description:</strong> {album.description}</p>
      <p><strong>Format:</strong> {album.format.join(', ')}</p>
      {user && user.isEditor && (
        <div className={s.album__actions}>
          <Button label="Edit" onClick={onEditClick}/>
          <Button label="Delete" onClick={onDeleteClick}/>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
