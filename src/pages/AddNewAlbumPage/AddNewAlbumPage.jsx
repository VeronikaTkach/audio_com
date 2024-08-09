import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { AlbumGrid } from '../../components/AlbumGrid';
import { Button } from '../../components/ui/Button/Button';
import { fetchGenres } from '../../core/store/genresSlice';
import { fetchAlbums } from '../../core/store/albumsSlice';
import s from './styles.module.scss';

export const AddNewAlbumPage = () => {
  const [album, setAlbum] = useState({
    title: '',
    artist: '',
    description: '',
    format: '',
    genre: [],
    image: '',
    release_date: '',
    value_of_tracks: ''
  });
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'format') {
      const formats = album.format.includes(value)
        ? album.format.filter(f => f !== value)
        : [...album.format, value];
      setAlbum({ ...album, format: formats });
    } else {
      setAlbum({ ...album, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFileName(file.name);
    setAlbum({ ...album, image: file.name });
  };

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

        if (error && error.code !== 'PGRST116') { // Если ошибка не связана с отсутствием записи
            console.error('Error checking genre:', error.message);
            throw error;
        }

        if (data) {
            // Жанр уже существует, добавляем его ID в список
            genreIds.push(data.genre_id);
        } else {
            // Жанра нет, добавляем его
            const { data: newGenre, error: genreError } = await supabase
                .from('genre')
                .insert({ genre: trimmedGenre })
                .select()
                .single();

            if (genreError) {
                console.error('Error adding genre:', genreError.message);
                throw genreError;
            }

            // Добавляем ID нового жанра в список
            genreIds.push(newGenre.genre_id);
        }
    }

    return genreIds;
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
    }

    try {
      // Сначала сохраняем жанры и получаем их IDs
      const genreIds = await saveGenres(album.genre);

      const newAlbum = {
        ...album,
        image: imageUrl || defaultCover
      };

      // Вставляем альбом в таблицу albums
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

      // Вставляем связи альбомов с жанрами в таблицу genre_album
      for (const genreId of genreIds) {
        await supabase
          .from('genre_album')
          .insert({ album_id: createdAlbum.id, genre_id: genreId });
      }

      alert('New Album Created');
      dispatch(fetchAlbums({ page: 1, perPage: 10 })).then(() => {
        navigate('/catalog');
      });

    } catch (err) {
      console.error('Error saving album:', err.message);
      setError('Error saving album: ' + err.message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

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
