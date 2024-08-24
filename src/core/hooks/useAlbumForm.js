import { useState, useEffect } from 'react';
import {
  fetchGenresFromSupabase,
  saveGenresToSupabase,
  saveFormatsToSupabase,
  uploadImageToSupabase,
} from '../utils/supabaseHelpers';
import { toast } from 'react-toastify';

export const useAlbumForm = (initialAlbum = null, mode = 'add') => {
  const [album, setAlbum] = useState(
    initialAlbum || {
      title: '',
      artist: '',
      description: '',
      format: [],
      genre: [],
      image: '',
      release_date: '',
      value_of_tracks: '',
    }
  );
  const [originalAlbum, setOriginalAlbum] = useState(initialAlbum);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await fetchGenresFromSupabase();
        setGenres(fetchedGenres.map((genre) => ({ value: genre.genre, label: genre.genre })));
      } catch (err) {
        setError('Error fetching genres: ' + err.message);
      }
    };

    fetchGenres();

    if (mode === 'edit' && initialAlbum) {
      setAlbum(initialAlbum);
      setOriginalAlbum(initialAlbum);
    }
  }, [initialAlbum, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'format') {
      const formats = album.format.includes(value)
        ? album.format.filter((f) => f !== value)
        : [...album.format, value];
      setAlbum({ ...album, format: formats });
    } else if (name === 'genre') {
      const genres = Array.isArray(value) ? value : [value];
      const filteredGenres = genres.filter((g) => g && g.trim() !== '');
      setAlbum({ ...album, genre: filteredGenres });
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

  const handleSaveChanges = async (customSaveCallback) => {
    try {
      const genreIds = await saveGenresToSupabase(album.genre);
      const formatIds = await saveFormatsToSupabase(album.format);
  
      if (imageFile) {
        album.image = await uploadImageToSupabase(album.artist, album.title, imageFile);
      }

      await customSaveCallback(album, genreIds, formatIds);
      const updatedGenres = await fetchGenresFromSupabase();
      setGenres(updatedGenres.map((genre) => ({ value: genre.genre, label: genre.genre })));
      toast.success('Album saved successfully!');
    } catch (err) {
      setError('Error saving album: ' + err.message);
      console.error(err);
    }
  };

  return {
    album,
    genres,
    error,
    imageFile,
    fileName,
    handleInputChange,
    handleImageChange,
    handleSaveChanges,
    setAlbum,
    originalAlbum,
  };
};
