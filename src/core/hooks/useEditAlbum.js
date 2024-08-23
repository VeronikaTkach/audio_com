// src/hooks/useEditAlbum.js

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { supabase } from '../../../supabaseClient';
import { fetchGenres } from '../store/genresSlice';

export const useEditAlbum = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [originalAlbum, setOriginalAlbum] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    const fetchAlbum = async () => {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single();
  
      if (error) {
        setError('Error fetching album: ' + error.message);
      } else if (data) {
        data.genre = typeof data.genre === 'string' ? JSON.parse(data.genre) : data.genre;
        data.format = typeof data.format === 'string' ? JSON.parse(data.format) : data.format;
        setAlbum(data);
        setOriginalAlbum(data);
      } else {
        setError('Album not found');
      }
    };
  
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

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
      if (!album) {
        setError('No album data available');
        return;
      }

      const genreIds = await saveGenres(album.genre);
      const formatIds = await saveFormats(album.format);

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

        album.image = publicUrlResponse.publicUrl;
      }

      const { error: updateError } = await supabase
        .from('albums')
        .update(album)
        .eq('id', albumId)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

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

      toast.success('Album updated successfully!');
      navigate(`/album/${albumId}`);

    } catch (err) {
      setError('Error updating album: ' + err.message);
    }
  };

  const handleCancel = () => {
    if (JSON.stringify(album) !== JSON.stringify(originalAlbum)) {
      setShowConfirmCancel(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmCancel = () => {
    navigate('/catalog');
  };

  const handleStay = () => {
    setShowConfirmCancel(false);
  };

  return {
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
  };
};
