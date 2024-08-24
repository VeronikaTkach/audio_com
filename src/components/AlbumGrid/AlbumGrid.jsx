import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import { GenreDropdown } from '../ui/GenreDropDown';
import { Button } from '../ui/Button/Button';
import TextareaAutosize from 'react-textarea-autosize';
import s from './styles.module.scss';

export const AlbumGrid = ({
  album,
  genres,
  handleInputChange,
  handleImageChange = null,
  imageFile = null,
  fileName = '',
  isEdit = false,
}) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [options, setOptions] = useState(genres);

  useEffect(() => {
    setOptions(genres);

    if (album.genre) {
      const genresArray = Array.isArray(album.genre) ? album.genre : JSON.parse(album.genre);
      const newSelectedGenres = genresArray.map((g) => ({ value: g, label: g }));
      
      if (JSON.stringify(newSelectedGenres) !== JSON.stringify(selectedGenres)) {
        setSelectedGenres(newSelectedGenres);
      }
    }
  }, [album.genre, genres]);

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
    handleInputChange({
      target: { name: 'genre', value: selectedOptions.map((option) => option.value) },
    });

  };

  return (
    <div className={s.album__form}>
      <div className={s.form__group}>
        <label>Title</label>
        <TextareaAutosize
          className={s.textArea}
          name="title"
          value={album.title}
          onChange={handleInputChange}
          minRows={1}
          maxRows={10}
        />
      </div>
      <div className={s.form__group}>
        <label>Artist</label>
        <TextareaAutosize
          className={s.textArea}
          name="artist"
          value={album.artist}
          onChange={handleInputChange}
          minRows={1}
          maxRows={10}
        />
      </div>
      <div className={s.form__group}>
        <label>Description</label>
        <TextareaAutosize
          className={s.textArea}
          name="description"
          value={album.description}
          onChange={handleInputChange}
          minRows={1}
          maxRows={10}
        />
      </div>
      <div className={s.form__group}>
        <label>Format</label>
        <div className={s.form__group__block}>
          <label className={s.form__group__label}>
            <input
              type="checkbox"
              name="format"
              value="Vinyl"
              checked={album.format.includes('Vinyl')}
              onChange={handleInputChange}
            />
            Vinyl
          </label>
          <label className={s.form__group__label}>
            <input
              type="checkbox"
              name="format"
              value="Digital"
              checked={album.format.includes('Digital')}
              onChange={handleInputChange}
            />
            Digital
          </label>
          <label className={s.form__group__label}>
            <input
              type="checkbox"
              name="format"
              value="CD"
              checked={album.format.includes('CD')}
              onChange={handleInputChange}
            />
            CD
          </label>
        </div>
      </div>
      <div className={s.form__group}>
        <label>Genre</label>
        <GenreDropdown 
          selectedGenres={selectedGenres} 
          handleGenreChange={handleGenreChange} 
          options={options} 
          setOptions={setOptions}
        />
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
        <TextareaAutosize
          className={s.textArea}
          name="value_of_tracks"
          value={album.value_of_tracks}
          onChange={handleInputChange}
          minRows={1}
          maxRows={10}
        />
      </div>
    </div>
  );
};

AlbumGrid.propTypes = {
  album: PropTypes.object.isRequired,
  genres: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func,
  imageFile: PropTypes.object,
  fileName: PropTypes.string,
  isEdit: PropTypes.bool,
};
