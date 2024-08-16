import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { ConfirmDeleteModal } from '../../ui/ConfirmDeleteModal';
import { supabase } from '../../../../supabaseClient';

export const DeleteAlbumButton = ({ albumId, onDelete, className }) => { // Убрали refreshAlbums из пропсов
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false); // Скрываем модальное окно до выполнения операции
    setIsDeleting(true);

    try {
      // Удаление связанных данных из format_album и genre_album
      await supabase
        .from('format_album')
        .delete()
        .eq('album_id', albumId);

      await supabase
        .from('genre_album')
        .delete()
        .eq('album_id', albumId);

      // Удаление альбома из таблицы albums
      const { error: albumError } = await supabase
        .from('albums')
        .delete()
        .eq('id', albumId);

      setIsDeleting(false);

      if (albumError) {
        console.error('Error deleting album:', albumError);
        alert(`Failed to delete album: ${albumError.message}`);
      } else {
        // Принудительно скрываем модальное окно после закрытия алерта
        setShowConfirmDelete(false);

        // Перезагрузка страницы после успешного удаления
        alert('Album deleted successfully!');
        // window.location.reload(); // Перезагрузка страницы
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      setIsDeleting(false);
      setShowConfirmDelete(false); // Принудительно скрываем модальное окно в случае ошибки
      alert(`Failed to delete album: ${error.message}`);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(false);
  };

  return (
    <>
      <Button 
        label={isDeleting ? "Deleting..." : "Delete"} 
        onClick={handleDeleteClick} 
        className={className}
        disabled={isDeleting}
      />
      {showConfirmDelete && (
        <ConfirmDeleteModal 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};
