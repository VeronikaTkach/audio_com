import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAlbumForm } from './useAlbumForm';
import { supabase } from '../../../supabaseClient';

export const useEditAlbum = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [initialAlbum, setInitialAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    const fetchAlbumData = async (id) => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Error fetching album: ' + error.message);
      } else {
        setInitialAlbum(data);
      }

      setLoading(false);
    };

    if (albumId) {
      fetchAlbumData(albumId);
    }
  }, [albumId]);

  const {
    album,
    genres,
    error: formError,
    imageFile,
    fileName,
    handleInputChange: formHandleInputChange,
    handleImageChange: formHandleImageChange,
    handleSaveChanges,
    originalAlbum,
  } = useAlbumForm(initialAlbum, 'edit');

  const handleInputChange = (e) => {
    setUnsavedChanges(true);
    formHandleInputChange(e);
  };

  const handleImageChange = (e) => {
    setUnsavedChanges(true);
    formHandleImageChange(e);
  };

  const handleSave = async (album, genreIds, formatIds) => {
    const { error: updateError } = await supabase
      .from('albums')
      .update(album)
      .eq('id', albumId)
      .select()
      .single();

    if (updateError) throw new Error('Error updating album: ' + updateError.message);

    await supabase.from('genre_album').delete().eq('album_id', albumId);
    await Promise.all(
      genreIds.map((genreId) =>
        supabase.from('genre_album').insert({ album_id: albumId, genre_id: genreId })
      )
    );

    await supabase.from('format_album').delete().eq('album_id', albumId);
    await Promise.all(
      formatIds.map((formatId) =>
        supabase.from('format_album').insert({ album_id: albumId, format_id: formatId })
      )
    );

    setUnsavedChanges(false);
    navigate(`/album/${albumId}`);
  };

  const handleSaveChangesWrapper = () => handleSaveChanges(handleSave);

  const handleCancel = () => {
    if (unsavedChanges) {
      setShowConfirmCancel(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancel(false);
    setUnsavedChanges(false);
    navigate(-1);
  };

  const handleStay = () => {
    setShowConfirmCancel(false);
  };

  return {
    album,
    genres,
    loading,
    error: formError || error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges: handleSaveChangesWrapper,
    handleCancel,
    showConfirmCancel,
    handleConfirmCancel,
    handleStay,
  };
};
