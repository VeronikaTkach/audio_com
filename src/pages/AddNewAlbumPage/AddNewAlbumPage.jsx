import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { fetchAlbums } from '../../core/store/albumsSlice';
import s from './styles.module.scss';

export const AddNewAlbumPage = () => {
  const [album, setAlbum] = useState({
    title: '',
    artist: '',
    description: '',
    format: '',
    genre: '',
    image: '',
    release_date: '',
    value_of_tracks: 0
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  const handleSaveChanges = async () => {
    const { title, artist, description, format, genre, image, release_date, value_of_tracks } = album;

    const newAlbum = {
      title: title || 'Untitled Album',
      artist: artist || 'Unknown Artist',
      description: description || 'No description',
      format: format || 'Digital',
      genre: genre || 'Unknown Genre',
      image: image || 'https://example.com/default-image.jpg',
      release_date: release_date || '2000-01-01',
      value_of_tracks: value_of_tracks || 0
    };

    const { data, error } = await supabase
      .from('albums')
      .insert(newAlbum);

      if (error) {
        if (error.code === '23505') {
          setError('Title, description or image URL already exists.');
        } else {
          setError("Error creating album: " + error.message);
        }
        console.error("Error creating album:", error);
      } else {
        console.log("New album created successfully:", data);
        alert("New Album Created");
        dispatch(fetchAlbums({ page: 1, perPage: 10 })).then(() => {
          navigate('/catalog');
        });
      }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={s.add__page}>
      <h2>New Album</h2>
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
      <button onClick={handleSaveChanges} className={s.save__button}>Ok</button>
      <button onClick={handleCancel} className={s.cancel__button}>Cancel</button>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
};
