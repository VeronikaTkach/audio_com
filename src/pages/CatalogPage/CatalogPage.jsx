import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAlbums, setSearchTerm, setCurrentPage, deleteAlbum } from '../../core/store/albumsSlice';
import { supabase } from '../../../supabaseClient';
import { SearchInput } from '../../components/ui/SearchInput';
import { CardAlbum } from '../../components/ui/CardAlbum';
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

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const filteredAlbums = albums.filter(album => {
    const searchWords = searchTerm.toLowerCase().split(' ');
    return searchWords.every(word =>
      album.title.toLowerCase().includes(word) ||
      album.artist.toLowerCase().includes(word)
    );
  });

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
      <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
      <div className={s.catalog__albums__list}>
      {currentAlbums.map(album => (
          <CardAlbum
            key={album.id}
            album={album}
            onAlbumClick={handleAlbumClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
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