import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
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
  const currentTheme = useSelector(selectTheme)

  return (
      <div className={`App ${currentTheme}`}>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/album/edit/:albumId" element={<EditPage />} />
          <Route path="/auth" element={<Authentification />} />
          <Route path="/album/new" element={<AddNewAlbumPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
  );
}

export default App
