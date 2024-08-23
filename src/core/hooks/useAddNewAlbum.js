// src/hooks/useAddNewAlbum.js

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../../../supabaseClient';
import { fetchGenres, fetchAlbums } from '../../core/store/store';

export const useAddNewAlbum = () => {
  const [album, setAlbum] = useState({
    title: '',
    artist: '',
    description: '',
    format: [],
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
    try {
      if (await checkIfSuchAlbumExists()) {
        setError('Such album of such artist exists already');
        return;
      }

      let imageUrl = album.image;

      if (imageFile) {
        const coverPath = createCoverPath(album.artist, album.title);
        const { error: uploadError } = await supabase.storage
          .from('album_covers')
          .upload(coverPath, imageFile, { upsert: true });

        if (uploadError) {
          setError('Error uploading image: ' + uploadError.message);
          return;
        }

        const { data: publicUrlResponse, error: urlError } = supabase.storage
          .from('album_covers')
          .getPublicUrl(coverPath);

        if (urlError) {
          setError('Error getting public URL: ' + urlError.message);
          return;
        }

        imageUrl = publicUrlResponse.publicUrl;
      }

      const genreIds = await saveGenres(album.genre);
      const formatIds = await saveFormats(album.format);

      const newAlbum = { ...album, image: imageUrl };
      const { data: createdAlbum, error: albumError } = await supabase
        .from('albums')
        .insert(newAlbum)
        .select()
        .single();

      if (albumError) {
        setError('Error creating album: ' + albumError.message);
        return;
      }

      await Promise.all(
        genreIds.map((genreId) =>
          supabase.from('genre_album').insert({ album_id: createdAlbum.id, genre_id: genreId })
        )
      );

      await Promise.all(
        formatIds.map((formatId) =>
          supabase.from('format_album').insert({ album_id: createdAlbum.id, format_id: formatId })
        )
      );

      toast.success('New Album Created!');
      dispatch(fetchAlbums({ page: 1, perPage: 10 })).then(() => {
        navigate('/catalog');
      });

    } catch (err) {
      setError('Error saving album: ' + err.message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return {
    album,
    error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges,
    handleCancel,
  };
};
