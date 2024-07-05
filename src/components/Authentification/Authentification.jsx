import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, registerUser } from "../../core/store/userSlice";
import s from './styles.module.scss'

export const Authentification = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const { authStatus, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(fetchUser(email)).unwrap();
      if (user) {
        console.log('Вы вошли в профиль');
      } else {
        await dispatch(registerUser({ email, userName })).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to authenticate user:', error);
    }
  };


  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <span className={s.modal__close} onClick={onClose}>&times;</span>
        <div className={s.modal__title}>Log in / Sign in</div>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button type="submit" disabled={authStatus === 'loading'}>Submit</button>
        </form>
        {error && <p className={s.modal__error}>{error}</p>}
      </div>
    </div>
  )
}