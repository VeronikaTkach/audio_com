import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../supabaseClient';
import { deleteAlbum } from '../../core/store/albumsSlice';
import { toast } from 'react-toastify';

export const useDeleteAlbum = () => {
  const dispatch = useDispatch();
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = (id) => {
    setSelectedAlbumId(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await supabase.from('format_album').delete().eq('album_id', selectedAlbumId);
      await supabase.from('genre_album').delete().eq('album_id', selectedAlbumId);
      await supabase.from('favorites').delete().eq('album_id', selectedAlbumId);

      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .delete()
        .eq('id', selectedAlbumId)
        .select()
        .single();

      if (albumError) {
        throw new Error(albumError.message);
      }

      if (albumData.image) {
        const coverPath = `covers/${albumData.artist}/${albumData.title}`;
        const { error: storageError } = await supabase.storage.from('album_covers').remove([coverPath]);

        if (storageError) {
          throw new Error(storageError.message);
        }
      }

      dispatch(deleteAlbum(selectedAlbumId));
      setShowConfirmDelete(false);
      setSelectedAlbumId(null);
      toast.success('Album deleted successfully!');
    } catch (error) {
      console.error('Error deleting album:', error.message);
      toast.error('Failed to delete album.');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setSelectedAlbumId(null);
  };

  return {
    selectedAlbumId,
    showConfirmDelete,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
