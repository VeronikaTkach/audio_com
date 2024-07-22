import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../../core/store/userSlice';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../assets/styles/themes/ThemeToggle';
import { Button } from '../ui/Button/Button';
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
  }

  const handleFavoritesClick = () => {
    navigate('/favorites');
  };

  return (
    <div className={s.header}>
      <LinkLikeButton label="Catalog" to="/catalog" />
      <ThemeToggle />
      {user ? (
        <div className={s.header__info}>
          {!user.isEditor && (
            <Button label="Favorites" onClick={handleFavoritesClick}/>
          )}
          <span>{user.email} ({user.isEditor ? 'Editor' : 'User'})</span>
          <Button label="Log out" onClick={handleLogout}/>
        </div>
      ) : (
        <Button label="Log in/ Sign in" onClick={handleAuthClick}/>
      )}
    </div>
  )
}
