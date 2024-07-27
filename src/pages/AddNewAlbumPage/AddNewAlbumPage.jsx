import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { fetchAlbums } from '../../core/store/albumsSlice';
import { fetchAllGenres } from '../../core/store/genresSlice';
import { AlbumGrid } from '../../components/AlbumGrid';
import { Button } from '../../components/ui/Button/Button';
import defaultCover from '../../assets/defaultCover.webp';
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
    dispatch(fetchAllGenres());
  }, [dispatch]);

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

      console.log("Upload response:", uploadResponse);

      const { data: publicUrlResponse } = supabase
        .storage
        .from('album_covers')
        .getPublicUrl(coverPath);

      if (publicUrlResponse.error) {
        console.error('Error getting public URL:', publicUrlResponse.error);
        setError('Error getting public URL: ' + publicUrlResponse.error.message);
        return;
      }

      imageUrl = publicUrlResponse.publicUrl;

      console.log("Public URL response:", publicUrlResponse);
      console.log("Image URL:", imageUrl);
    }

    const newAlbum = {
      ...album,
      image: imageUrl || defaultCover
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
      <AlbumGrid
        album={album}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        imageFile={imageFile}
        fileName={fileName}
        isEdit={false}
      />
      <div className={s.add__actions}>
        <Button label="Ok" onClick={handleSaveChanges}/>
        <Button label="Cancel" onClick={handleCancel}/>
      </div>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
};
