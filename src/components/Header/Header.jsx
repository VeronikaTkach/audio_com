import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../../core/store/userSlice';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../assets/styles/themes/ThemeToggle';
import s from './styles.module.scss';

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  }

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleHomeClick = () => {
    navigate('/catalog');
  };

  return (
    <div className={s.header}>
      <button onClick={handleHomeClick} className={s.header__button}>Catalog</button>
      <ThemeToggle />
      {user ? (
        <div className={s.header__info}>
          {!user.isEditor && (
            <button onClick={handleFavoritesClick} className={s.header__button}>Favorites</button>
          )}
          <span>{user.email} ({user.isEditor ? 'Editor' : 'User'})</span>
          <button onClick={handleLogout} className={s.header__button}>Log out</button>
        </div>
      ) : (
        <button onClick={handleAuthClick} className={s.header__button}>Log in / Sign in</button>
      )}
    </div>
  )
}
