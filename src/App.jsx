import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import ThemeToggle from './assets/styles/themes/ThemeToggle'
import { selectTheme } from './assets/styles/themes/slice'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { AlbumPage } from './pages/AlbumPage/AlbumPage'
import { EditPage } from './pages/EditPage/EditPage'
import { Authentification } from './components/Authentification'
import { Header } from '../src/components/Header'
import { AddNewAlbumPage } from './pages/AddNewAlbumPage/AddNewAlbumPage'
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage'
import './App.css'

function App() {
  const currentTheme = useSelector(selectTheme);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
    navigate('/auth');
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    navigate(-1);
  };

  return (
      <div className={`App ${currentTheme}`}>
        <Header onOpenAuthModal={handleOpenAuthModal} />
        <div className='routes'>
          <Routes>
            <Route path="/" element={<Navigate to="/catalog" />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/album/:albumId" element={<AlbumPage />} />
            <Route path="/album/edit/:albumId" element={<EditPage />} />
            <Route path="/auth" element={<Authentification onClose={handleCloseAuthModal} />} />
            <Route path="/album/new" element={<AddNewAlbumPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </div>
  );
}

export default App
