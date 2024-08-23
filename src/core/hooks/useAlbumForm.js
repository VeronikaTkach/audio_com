import { useState } from 'react';
import { supabase } from '../../../supabaseClient';

export const useAlbumForm = () => {
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

  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

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

  return {
    album,
    imageFile,
    fileName,
    error,
    setError,
    handleInputChange,
    handleImageChange,
  };
};
