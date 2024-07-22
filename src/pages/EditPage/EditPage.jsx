import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { AlbumGrid } from '../../components/AlbumGrid';
import { ConfirmCancelModal } from '../../components/ui/ConfirmCancelModal';
import { Button } from '../../components/ui/Button';
import s from './styles.module.scss';

export const EditPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [originalAlbum, setOriginalAlbum] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
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
    </div>
  );
};
