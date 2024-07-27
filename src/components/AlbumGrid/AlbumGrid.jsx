import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import { GenreDropdown } from '../ui/GenreDropDown';
import { Button } from '../ui/Button/Button';
import s from './styles.module.scss';

export const AlbumGrid = ({ album, handleInputChange, handleImageChange, imageFile, fileName, isEdit }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    if (album.genre) {
      const genresArray = typeof album.genre === 'string' ? JSON.parse(album.genre) : album.genre;
      setSelectedGenres(genresArray.map(g => ({ value: g, label: g })));
    }
  }, [album.genre]);

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
    handleInputChange({ target: { name: 'genre', value: selectedOptions.map(option => option.value) } });
  };

  return (
    <div className={s.album__form}>
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
        <GenreDropdown selectedGenres={selectedGenres} handleGenreChange={handleGenreChange} />
      </div>
      <div className={s.form__group}>
        <label style={{ textAlign: 'start' }}>Image URL</label>
        <div className={s.file__input}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="file-upload"
            className={s.hidden__input}
          />
          <Button
            label="Choose File"
            onClick={() => document.getElementById('file-upload').click()}
          />
          {imageFile || isEdit ? (
            <span className={s.check__icon}>
              <FaCheckCircle title={isEdit ? album.image : fileName} />
            </span>
          ) : (
            <span>No file chosen</span>
          )}
        </div>
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
          type="text"
          name="value_of_tracks"
          value={album.value_of_tracks}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

AlbumGrid.propTypes = {
  album: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func,
  imageFile: PropTypes.object,
  fileName: PropTypes.string,
  isEdit: PropTypes.bool
};

AlbumGrid.defaultProps = {
  handleImageChange: null,
  imageFile: null,
  fileName: '',
  isEdit: false
};
