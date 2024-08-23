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
        <div className={s.album__fav_icon} onClick={handleAddToFavoritesClick}>
          {isFavorite ? <FaStar size={36} color="gold" /> : <FaRegStar size={36} color="gold" />}
        </div>
      )}
      </div>
      <h2>{album.artist}</h2>
      <table className={s.album__table}>
        <tbody>
          <tr className={s.album__table_row}>
            <td className={s.album__table_cell}>Genre:</td>
            <td className={s.album__table_cell}>{album.genre.join(', ')}</td>
          </tr>
          <tr className={s.album__table_row}>
            <td className={s.album__table_cell}>Release Date:</td>
            <td className={s.album__table_cell}>{album.release_date}</td>
          </tr>
          <tr className={s.album__table_row}>
            <td className={s.album__table_cell}>Tracks:</td>
            <td className={s.album__table_cell}>{album.value_of_tracks}</td>
          </tr>
          <tr className={s.album__table_row}>
            <td className={s.album__table_cell}>Description:</td>
            <td className={s.album__table_cell}>{album.description}</td>
          </tr>
          <tr className={s.album__table_row}>
            <td className={s.album__table_cell}>Format:</td>
            <td className={s.album__table_cell}>{album.format.join(', ')}</td>
          </tr>
        </tbody>
      </table>
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
