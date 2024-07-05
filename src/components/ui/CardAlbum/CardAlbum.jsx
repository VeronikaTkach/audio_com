import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const CardAlbum = ({ album, onAlbumClick, onEditClick, onDeleteClick }) => {
  return (
    <div className={s.album__item}>
      <div onClick={() => onAlbumClick(album.id)} className={s.album__info}>
        <div className={s.album__title}>{album.title}</div>
        <div className={s.album__artist}>{album.artist}</div>
      </div>
      <div className={s.album__actions}>
        <button onClick={() => onEditClick(album.id)} className={s.edit__button}>Edit</button>
        <button onClick={() => onDeleteClick(album.id)} className={s.delete__button}>Delete</button>
      </div>
    </div>
  );
};

CardAlbum.propTypes = {
  album: PropTypes.object.isRequired,
  onAlbumClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
}
