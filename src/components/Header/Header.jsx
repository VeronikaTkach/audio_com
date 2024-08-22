import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../../core/store/userSlice';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../assets/styles/themes/ThemeToggle';
import { BurgerMenu } from './BurgerMenu';
import { Button } from '../ui/Button';
import { LinkLikeButton } from '../ui/LinkLikeButton';
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
  };

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  const handleNewAlbumClick = () => {
    navigate('/album/new');
  };

  return (
    <div className={s.header}>
      <div className={s.header__actions}>
        <LinkLikeButton label="Catalog" to="/catalog" />
        <ThemeToggle />
      </div>

      {/* Подключаем BurgerMenu */}
      <BurgerMenu
        user={user}
        handleNewAlbumClick={handleNewAlbumClick}
        handleFavoritesClick={handleFavoritesClick}
        handleLogout={handleLogout}
        handleAuthClick={handleAuthClick}
      />

      {/* Regular Header Actions for screens wider than 770px */}
      <div className={`${s.header__info} ${s.desktopOnly}`}>
        {user ? (
          <>
            {user.isEditor && (
              <Button label="Create New Album" onClick={handleNewAlbumClick} />
            )}
            <Button label="Favorites" onClick={handleFavoritesClick} />
            <span>{user.email} ({user.isEditor ? 'Editor' : 'User'})</span>
            <Button label="Log out" onClick={handleLogout} />
          </>
        ) : (
          <Button label="Log in/ Sign in" onClick={handleAuthClick} />
        )}
      </div>
    </div>
  );
};
