import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { fetchAlbums } from '../../core/store/albumsSlice';
import { Button } from '../../components/ui/Button/Button';
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
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbum({ ...album, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setAlbum({ ...album, image: file.name });
  };

  const checkIfSuchAlbumExists = async () => {
    let response = await supabase
      .from('albums')
      .select("title", "artist")
      .eq('title', album.title)
      .eq('artist', album.artist);

      return response.data.length > 0;
  };

  const createCoverPath = (artist, title) => {
    return `covers/${artist}/${title}`;
  }

  const handleSaveChanges = async () => {

    let albumExists = await checkIfSuchAlbumExists();

    if(albumExists){
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

      imageUrl = publicUrlResponse.publicUrl;    
    }

    const newAlbum = {
      ...album,
      image: imageUrl || 'https://example.com/default-image.jpg'
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
      <h1>New Album</h1>
      <div className={s.add__form}>
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
          <input
            type="text"
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className={s.form__group}>
          <label style={{ textAlign: 'start' }}>Release Date</label>
          <input
            type="date"
            name="release_date"
            value={album.release_date}
            onChange={handleInputChange}
          />
        </div>
        <div className={s.form__group}>
          <label style={{ textAlign: 'start' }}>Number of Tracks</label>
          <input
            type="number"
            name="value_of_tracks"
            value={album.value_of_tracks}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className={s.add__actions}>
        <Button label="Ok" onClick={handleSaveChanges}/>
        <Button label="Cancel" onClick={handleCancel}/>
      </div>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
};
