import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../supabaseClient';
import { AlbumGrid } from '../../components/AlbumGrid';
import { ConfirmCancelModal } from '../../components/ui/ConfirmCancelModal';
import { Button } from '../../components/ui/Button/Button';
import { fetchGenres } from '../../core/store/genresSlice';
import s from './styles.module.scss';

export const EditPage = () => {
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
        console.error('Error fetching album:', error);
      } else {
        setAlbum(data);
        setOriginalAlbum(data);
      }
    };

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
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
    const { title, artist, description, format, genre, image, release_date, value_of_tracks } = album;

    try {
      // Сначала сохраняем жанры и получаем их IDs
      const genreIds = await saveGenres(genre);

      if (imageFile) {
        const coverPath = createCoverPath(album.artist, album.title);

        const { data: uploadResponse, error: uploadError } = await supabase
          .storage
          .from('album_covers')
          .upload(coverPath, imageFile, {
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          setError('Error uploading image: ' + uploadError.message);
          return;
        }

        const { data: publicUrlResponse } = supabase
          .storage
          .from('album_covers')
          .getPublicUrl(coverPath);

        if (publicUrlResponse.error) {
          console.error('Error getting public URL:', publicUrlResponse.error);
          setError('Error getting public URL: ' + publicUrlResponse.error.message);
          return;
        }

        album.image = publicUrlResponse.publicUrl;
      }

      // Обновляем альбом в таблице albums
      const { data: updatedAlbum, error: updateError } = await supabase
        .from('albums')
        .update({
          title,
          artist,
          description,
          format,
          genre,
          image,
          release_date,
          value_of_tracks
        })
        .eq('id', albumId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating album:', updateError.message);
        setError('Error updating album: ' + updateError.message);
        return;
      }

      // Удаляем старые связи альбома с жанрами в таблице genre_album
      await supabase
        .from('genre_album')
        .delete()
        .eq('album_id', albumId);

      // Добавляем новые связи альбома с жанрами
      for (const genreId of genreIds) {
        await supabase
          .from('genre_album')
          .insert({ album_id: albumId, genre_id: genreId });
      }

      alert('Album updated successfully!');
      navigate(`/album/${albumId}`);

    } catch (err) {
      console.error('Error updating album:', err.message);
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
