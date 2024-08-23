import React from 'react';
import { AlbumGrid } from '../../components/AlbumGrid';
import { ConfirmCancelModal } from '../../components/ui/ConfirmCancelModal';
import { Button } from '../../components/ui/Button';
import { useEditAlbum } from '../../core/hooks/useEditAlbum';
import s from './styles.module.scss';

export const EditPage = () => {
  const {
    album,
    error,
    imageFile,
    fileName,
    showConfirmCancel,
    handleInputChange,
    handleImageChange,
    handleSaveChanges,
    handleCancel,
    handleConfirmCancel,
    handleStay,
  } = useEditAlbum();

  if (!album) return <div>Loading...</div>;

  return (
    <div className={s.edit__page}>
      <h1>Edit Album</h1>
      <AlbumGrid
        album={album}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        imageFile={imageFile}
        fileName={fileName}
        isEdit={true}
      />
      <div className={s.edit__actions}>
        <Button label="Save Changes" onClick={handleSaveChanges}/>
        <Button label="Cancel" onClick={handleCancel}/>
      </div>
      {showConfirmCancel && (
        <ConfirmCancelModal 
          onConfirm={handleConfirmCancel}
          onCancel={handleStay}
        />
      )}
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
};
