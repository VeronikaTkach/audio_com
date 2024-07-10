import { useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import ThemeToggle from './assets/styles/themes/ThemeToggle'
import { selectTheme } from './assets/styles/themes/slice'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { AlbumPage } from './pages/AlbumPage/AlbumPage'
import { Header } from '../src/components/Header'
import './App.css'

function App() {
  const currentTheme = useSelector(selectTheme)

  return (
      <div className={`App ${currentTheme}`}>
        <Header />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
        </Routes>
      </div>
  );
}

export default App
