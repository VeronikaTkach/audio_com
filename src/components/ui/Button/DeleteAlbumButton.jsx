import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { ConfirmDeleteModal } from '../../ui/ConfirmDeleteModal';
import { supabase } from '../../../../supabaseClient';
import { toast } from 'react-toastify';

export const DeleteAlbumButton = ({ albumId, onDelete, refreshAlbums, className }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDelete(false);
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

      // Проверка и удаление из favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('id')
        .eq('album_id', albumId);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError.message);
      } else if (favoritesData.length > 0) {
        // Если альбом есть в избранных, удалить его оттуда
        const favoriteIds = favoritesData.map(fav => fav.id);
        const { error: deleteFavoritesError } = await supabase
          .from('favorites')
          .delete()
          .in('id', favoriteIds);

        if (deleteFavoritesError) {
          console.error('Error deleting from favorites:', deleteFavoritesError.message);
          toast.error(`Failed to delete album from favorites: ${deleteFavoritesError.message}`);
        }
      }

      // Удаление альбома из таблицы albums
      const { error: albumError } = await supabase
        .from('albums')
        .delete()
        .eq('id', albumId);

      setIsDeleting(false);

      if (albumError) {
        console.error('Error deleting album:', albumError);
        toast.error(`Failed to delete album: ${albumError.message}`);
      } else {
        setShowConfirmDelete(false);

        if (refreshAlbums) {
          refreshAlbums();
        }

        if (onDelete) {
          onDelete(albumId);
        }

        toast.success('Album deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      setIsDeleting(false);
      setShowConfirmDelete(false);
      toast.error(`Failed to delete album: ${error.message}`);
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
