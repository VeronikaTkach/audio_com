
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, selectTheme } from './slice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  return (
    <div>
      <button onClick={() => dispatch(toggleTheme())}>
        Switch to {currentTheme === 'light' ? 'dark' : 'light'} theme
      </button>
    </div>
  );
};

export default ThemeToggle;