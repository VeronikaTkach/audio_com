import { useSelector } from 'react-redux'
import './App.css'
import ThemeToggle from './assets/styles/themes/ThemeToggle'
import { selectTheme } from './assets/styles/themes/slice'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'

function App() {
  const currentTheme = useSelector(selectTheme)

  return (
    <div className={`App ${currentTheme}`}>
      <div>App</div>
      <ThemeToggle/>
      <CatalogPage/>
    </div>
  )
}

export default App
