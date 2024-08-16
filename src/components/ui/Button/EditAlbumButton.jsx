import React from 'react';
import { Button } from '../../ui/Button';

export const EditAlbumButton = ({ albumId, onEdit, className }) => {
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(albumId);
  };

  return (
    <Button 
      label="Edit" 
      onClick={handleEditClick} 
      className={className} 
    />
  );
};
