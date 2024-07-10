import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import s from './styles.module.scss';

export const EditPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const navigate = useNavigate();

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

  const handleSaveChanges = async () => {
    const { title, artist, description, format, genre, image, release_date, value_of_tracks } = album;

    console.log("Sending data to Supabase:", {
      title, artist, description, format, genre, image, release_date, value_of_tracks
    });

    const { data, error } = await supabase
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
      .select('*');  // Добавьте этот вызов для получения обновленных данных

    if (error) {
      console.error("Error updating album:", error);
    } else {
      console.log("Album updated successfully:", data);
      alert("Album updated successfully!");
      navigate(`/album/${albumId}`);
    }
  };

  if (!album) return <div>Loading...</div>;

  return (
    <div className={s.edit__page}>
      <h2>Edit Album</h2>
      <div className={s.form__group}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={album.title}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Artist</label>
        <input
          type="text"
          name="artist"
          value={album.artist}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Description</label>
        <textarea
          name="description"
          value={album.description}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Format</label>
        <input
          type="text"
          name="format"
          value={album.format}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Genre</label>
        <input
          type="text"
          name="genre"
          value={album.genre}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={album.image}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Release Date</label>
        <input
          type="date"
          name="release_date"
          value={album.release_date}
          onChange={handleInputChange}
        />
      </div>
      <div className={s.form__group}>
        <label>Number of Tracks</label>
        <input
          type="number"
          name="value_of_tracks"
          value={album.value_of_tracks}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};
