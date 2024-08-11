import React from 'react';
import { Button } from '../../components/ui/Button';
import s from './styles.module.scss';

export const AlbumItem = ({ album, onClick, onEdit, onDelete, isEditor }) => {
  return (
    <div className={s.album__item} onClick={() => onClick(album.id)}>
      <div className={s.album__info}>
        <img src={album.image} alt={`${album.title} cover`} className={s.album__image} />
      </div>
      <div className={s.album__details}>
        <div className={s.album__artist}>{album.artist}</div>
        <div className={s.album__title}>{album.title}</div>
      </div>
      {isEditor && (
        <div className={s.album__actions}>
          <Button 
            label="Edit" 
            onClick={(e) => { e.stopPropagation(); onEdit(album.id); }} 
            className={s.album__button} 
          />
          <Button 
            label="Delete" 
            onClick={(e) => { e.stopPropagation(); onDelete(album.id); }} 
            className={s.album__button} 
          />
        </div>
      )}
    </div>
  );
};
