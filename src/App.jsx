import { useSelector } from 'react-redux'
import ThemeToggle from './assets/styles/themes/ThemeToggle'
import { selectTheme } from './assets/styles/themes/slice'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { Header } from '../src/components/Header'
import './App.css'

function App() {
  const currentTheme = useSelector(selectTheme)

  return (
    <div className={`App ${currentTheme}`}>
      <Header/>
      <ThemeToggle/>
      <CatalogPage/>
    </div>
  )
}

export default App
