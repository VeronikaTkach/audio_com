import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAlbumForm } from './useAlbumForm';
import { fetchAlbums } from '../../core/store/albumsSlice';
import { checkIfSuchAlbumExists } from '../utils/supabaseHelpers';
import { supabase } from '../../../supabaseClient';

export const useAddNewAlbum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    album,
    genres,
    error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges,
  } = useAlbumForm();

  const handleSave = async (album, genreIds, formatIds) => {
    if (await checkIfSuchAlbumExists(album.title, album.artist)) {
      throw new Error('Such album of such artist exists already');
    }
  
    const { data: createdAlbum, error: albumError } = await supabase
      .from('albums')
      .insert(album)
      .select()
      .single();
  
    if (albumError) throw new Error('Error creating album: ' + albumError.message);
  
    console.log('Created album:', createdAlbum); // Логирование созданного альбома

    // Привязка жанров к альбому
  if (genreIds.length > 0) {
    const genrePromises = genreIds.map((genreId) => 
      supabase.from('genre_album').insert({ album_id: createdAlbum.id, genre_id: genreId })
    );

    try {
      await Promise.all(genrePromises);
      console.log('Genres linked to album successfully');
    } catch (insertError) {
      console.error('Error linking genres to album:', insertError.message);
    }
  } else {
    console.log('No genres to link to album.');
  }
  
    // Привязка форматов к альбому
    await Promise.all(
      formatIds.map((formatId) =>
        supabase.from('format_album').insert({ album_id: createdAlbum.id, format_id: formatId })
      )
    );
  
    dispatch(fetchAlbums({ page: 1, perPage: 10 })).then(() => {
      navigate('/catalog');
    });
  };

  const handleSaveChangesWrapper = () => handleSaveChanges(handleSave);

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    album,
    genres,
    error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges: handleSaveChangesWrapper,
    handleCancel,
  };
};
