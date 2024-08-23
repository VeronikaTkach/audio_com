import React from 'react';
import { AlbumGrid } from '../../components/AlbumGrid';
import { Button } from '../../components/ui/Button/Button';
import { useAddNewAlbum } from '../../core/hooks/useAddNewAlbum';
import s from './styles.module.scss';

export const AddNewAlbumPage = () => {
  const {
    album,
    error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges,
    handleCancel,
  } = useAddNewAlbum();

  return (
    <div className={s.add__page}>
      <h1>New Album</h1>
      <AlbumGrid
        album={album}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        imageFile={imageFile}
        fileName={fileName}
        isEdit={false}
      />
      <div className={s.add__actions}>
        <Button label='Ok' onClick={handleSaveChanges} />
        <Button label='Cancel' onClick={handleCancel} />
      </div>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
};
