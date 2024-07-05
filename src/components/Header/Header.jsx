import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../../core/store/userSlice';
import { Authentification } from '../Authentification';
import s from './styles.module.scss';

export const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleAuthClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  }

  return (
    <>
      {user ? (
        <div>
          <span>{user.user_metadata.userName}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <button onClick={handleAuthClick}>Log in / Sign in</button>
      )}
      {showModal && <Authentification onClose={handleCloseModal} />}
    </>
  )
}
