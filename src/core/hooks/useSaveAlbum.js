// hooks/useSaveAlbum.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../../../supabaseClient';
import { fetchAlbums } from '../../core/store/albumsSlice';
import defaultCover from '../../assets/defaultCover.webp';

export const useSaveAlbum = (album, imageFile, setError) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkIfSuchAlbumExists = async () => {
    let response = await supabase
      .from('albums')
      .select('title', 'artist')
      .eq('title', album.title)
      .eq('artist', album.artist);

    return response.data.length > 0;
  };

  const createCoverPath = (artist, title) => {
    return `covers/${artist}/${title}`;
  };

  const saveGenres = async (genres) => {
    const genreIds = [];

    for (const genre of genres) {
        const trimmedGenre = genre.trim();

        // Проверяем, существует ли жанр в таблице genre
        let { data, error } = await supabase
            .from('genre')
            .select('genre_id')
            .eq('genre', trimmedGenre)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking genre:', error.message);
            throw error;
        }

        if (data) {
            genreIds.push(data.genre_id);

        } else {
            const { data: newGenre, error: genreError } = await supabase
                .from('genre')
                .insert({ genre: trimmedGenre })
                .select()
                .single();

            if (genreError) {
                console.error('Error adding genre:', genreError.message);
                throw genreError;
            }

            genreIds.push(newGenre.genre_id);
        }
    }

    return genreIds;
  };

  const saveFormats = async (formats) => {
    const formatIds = [];

    for (const format of formats) {
      const trimmedFormat = format.trim();

      // Проверяем, существует ли формат в таблице format
      let { data, error } = await supabase
        .from('format')
        .select('format_id')
        .eq('format', trimmedFormat)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking format:', error.message);
        throw error;
      }

      if (data) {
        formatIds.push(data.format_id);
      } else {
        const { data: newFormat, error: formatError } = await supabase
          .from('format')
          .insert({ format: trimmedFormat })
          .select()
          .single();

        if (formatError) {
          console.error('Error adding format:', formatError.message);
          throw formatError;
        }

        formatIds.push(newFormat.format_id);
      }
    }

    return formatIds;
  };

  const handleSaveChanges = async () => {
    let albumExists = await checkIfSuchAlbumExists();

    if (albumExists) {
      console.error('Such album of such artist exists already');
      setError('Such album of such artist exists already');
      return;
    }
    
    let imageUrl = album.image;

    if (imageFile) {
      const coverPath = createCoverPath(album.artist, album.title);

      const { data: uploadResponse, error: uploadError } = await supabase
        .storage
        .from('album_covers')
        .upload(coverPath, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setError('Error uploading image: ' + uploadError.message);
        return;
      }

      const { data: publicUrlResponse, error: urlError } = supabase
        .storage
        .from('album_covers')
        .getPublicUrl(coverPath);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        setError('Error getting public URL: ' + urlError.message);
        return;
      }

      imageUrl = publicUrlResponse.publicUrl;
    } else {
      imageUrl = defaultCover;
    }

    try {
      const genreIds = await saveGenres(album.genre);
      const formatIds = await saveFormats(album.format);

      const newAlbum = {
        ...album,
        image: imageUrl || defaultCover
      };

      const { data: createdAlbum, error: albumError } = await supabase
        .from('albums')
        .insert(newAlbum)
        .select()
        .single();

      if (albumError) {
        console.error('Error creating album:', albumError.message);
        setError('Error creating album: ' + albumError.message);
        return;
      }

      // Вставляем связи альбомов с жанрами и форматами в таблицы genre_album и format_album
      for (const genreId of genreIds) {
        await supabase
          .from('genre_album')
          .insert({ album_id: createdAlbum.id, genre_id: genreId });
      }

      for (const formatId of formatIds) {
        await supabase
          .from('format_album')
          .insert({ album_id: createdAlbum.id, format_id: formatId });
      }

      toast.success('New Album Created!');
      dispatch(fetchAlbums({ page: 1, perPage: 10 })).then(() => {
        navigate('/catalog');
      });

    } catch (err) {
      console.error('Error saving album:', err.message);
      setError('Error saving album: ' + err.message);
    }
  };

  return { handleSaveChanges };
};
