import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../../core/store/userSlice';
import { useNavigate } from 'react-router-dom';
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

  return (
    <>
      {user ? (
        <div>
          <span>{user.email} ({user.isEditor ? 'Editor' : 'User'})</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <button onClick={handleAuthClick}>Log in / Sign in</button>
      )}
    </>
  )
}
