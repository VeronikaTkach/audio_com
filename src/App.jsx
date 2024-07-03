import { useSelector } from 'react-redux'
import './App.css'
import ThemeToggle from './assets/styles/themes/ToggleTheme'
import { selectTheme } from './assets/styles/themes/slice'

function App() {
  const currentTheme = useSelector(selectTheme)

  return (
    <div className={`App ${currentTheme}`}>
      <div>App</div>
      <ThemeToggle/>
    </div>
  )
}

export default App
