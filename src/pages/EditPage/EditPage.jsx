import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import s from './styles.module.scss';

export const EditPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState({
    title: '',
    artist: '',
    genre: '',
    release_date: '',
    value_of_tracks: 0,
    description: '',
    format: '',
    image: ''
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('albums')
      .update(album)
      .eq('id', albumId);

    if (error) {
      console.error('Error updating album:', error);
    } else {
      navigate(`/album/${albumId}`);
    }
  };

  return (
    <div className={s.edit__page}>
      <h2>Edit Album</h2>
      <form onSubmit={handleSubmit} className={s.edit__form}>
        <label className={s.form__label}>
          Title:
          <input type="text" name="title" value={album.title} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Artist:
          <input type="text" name="artist" value={album.artist} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Genre:
          <input type="text" name="genre" value={album.genre} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Release Date:
          <input type="date" name="release_date" value={album.release_date} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Tracks:
          <input type="number" name="value_of_tracks" value={album.value_of_tracks} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Description:
          <textarea name="description" value={album.description} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Format:
          <input type="text" name="format" value={album.format} onChange={handleChange} required />
        </label>
        <label className={s.form__label}>
          Image URL:
          <input type="text" name="image" value={album.image} onChange={handleChange} required />
        </label>
        <button type="submit" className={s.form__button}>Save Changes</button>
      </form>
    </div>
  );
};
