import React from 'react';
import { Button } from '../../ui/Button';
import s from '../../../pages/AlbumPage/styles.module.scss';

export const AlbumDetails = ({ album, user, isFavorite, onEditClick, onDeleteClick, onAddToFavorites }) => {
  return (
    <div className={s.album__details}>
      <h2>{album.title}</h2>
      <h3>{album.artist}</h3>
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
      {user && !user.isEditor && !isFavorite && (
        <Button label="Add to Favorites" onClick={onAddToFavorites}/>
      )}
      {user && !user.isEditor && isFavorite && (
        <p>This album is already in your favorites.</p>
      )}
    </div>
  );
};
