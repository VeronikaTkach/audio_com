import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums, setSearchTerm, setCurrentPage, deleteAlbum } from '../../core/store/albumsSlice';
import { supabase } from '../../../supabaseClient';
import s from './styles.module.scss';

export const CatalogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const albums = useSelector(state => state.albums.items);
  const searchTerm = useSelector(state => state.albums.searchTerm);
  const currentPage = useSelector(state => state.albums.currentPage);
  const albumsPerPage = useSelector(state => state.albums.albumsPerPage);
  const status = useSelector(state => state.albums.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAlbums());
    }
  }, [status, dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAlbum = currentPage * albumsPerPage;
  const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
  const currentAlbums = filteredAlbums.slice(indexOfFirstAlbum, indexOfLastAlbum);

  const paginate = (pageNumber) => dispatch(setCurrentPage(pageNumber));

  const handleAlbumClick = (id) => {
    navigate.push(`/album/${id}`);
  };

  const handleEditClick = (id) => {
    navigate.push(`/album/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    await supabase
      .from('albums')
      .delete()
      .eq('id', id);
    dispatch(deleteAlbum(id));
  };

  return (
    <div className={s.container}>
      <div className={s.catalog__title}>Albums</div>
      <div className={s.catalog__search}>
        <input
          type="text"
          placeholder="Search albums..."
          value={searchTerm}
          onChange={handleSearch}
          className={s.catalog__search__input}
        />
      </div>
      <div className={s.catalog__albums__list}>
        {currentAlbums.map(album => (
          <div key={album.id} className={s.album__item}>
            <div onClick={() => handleAlbumClick(album.id)} className={s.album__info}>
              <div className={s.album__title}>{album.title}</div>
              <div className={s.album__artist}>{album.artist}</div>
            </div>
            <div className={s.album__actions}>
              <button onClick={() => handleEditClick(album.id)} className={s.edit__button}>Edit</button>
              <button onClick={() => handleDeleteClick(album.id)} className={s.delete__button}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className={s.catalog__pagination}>
        {Array.from({ length: Math.ceil(filteredAlbums.length / albumsPerPage) }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} className={s.page__button}>
              {i + 1}
            </button>
          ))}
      </div>
    </div>
  )
}