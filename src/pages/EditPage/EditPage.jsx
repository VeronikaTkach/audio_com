import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { AlbumGrid } from '../../components/AlbumGrid';
import { ConfirmCancelModal } from '../../components/ui/ConfirmCancelModal';
import { Button } from '../../components/ui/Button/Button';
import s from './styles.module.scss';

export const EditPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [originalAlbum, setOriginalAlbum] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [error, setError] = useState(null); // Добавляем состояние для ошибки
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

  const handleSaveChanges = async () => {
    const { title, artist, description, format, genre, image, release_date, value_of_tracks } = album;

    console.log("Sending data to Supabase:", {
      title, artist, description, format, genre, image, release_date, value_of_tracks
    });

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

      album.image = publicUrlResponse.publicUrl;

      console.log("Public URL response:", publicUrlResponse);
      console.log("Image URL:", album.image);
    }

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
      .select('*');

    if (error) {
      console.error("Error updating album:", error);
    } else {
      console.log("Album updated successfully:", data);
      alert("Album updated successfully!");
      navigate(`/album/${albumId}`);
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
