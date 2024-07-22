import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaSun, FaMoon } from 'react-icons/fa';
import { toggleTheme, selectTheme } from './slice';
import s from './styles.module.scss';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  const handleThemeChange = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(toggleTheme(newTheme));
  };

  return (
    <div className={s.toggle__container} onClick={handleThemeChange}>
      <div className={`${s.toggle__switch} ${currentTheme === 'dark' ? s.dark : ''}`}>
        {currentTheme === 'light' ? <FaSun className={s.icon} /> : <FaMoon className={s.icon} />}
      </div>
    </div>
  );
};

export default ThemeToggle;
