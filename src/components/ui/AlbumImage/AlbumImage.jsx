import React, { useState } from 'react';
import defaultCover from '../../../assets/photo.png';
import s from './styles.module.scss';

const AlbumImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(defaultCover);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={s.album__image}
      onError={handleError}
    />
  );
};

export default AlbumImage;
