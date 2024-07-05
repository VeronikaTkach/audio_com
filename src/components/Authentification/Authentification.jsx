import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, registerUser } from "../../core/store/userSlice";
import s from './styles.module.scss';

export const Authentification = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const dispatch = useDispatch();
  const { authStatus, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(fetchUser({ email, password })).unwrap();
      if (user) {
        console.log('Вы вошли в профиль');
        onClose();
      }
    } catch (error) {
      if (error.message.includes('Invalid login credentials')) {
        setShowUserNameInput(true);
      } else {
        console.error('Ошибка аутентификации пользователя:', error);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(registerUser({ email, password, userName })).unwrap();
      if (user) {
        console.log('Регистрация успешна');
        onClose();
      }
    } catch (error) {
      console.error('Ошибка регистрации пользователя:', error);
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <span className={s.modal__close} onClick={onClose}>&times;</span>
        <div className={s.modal__title}>Log in / Sign in</div>
        <form className={s.modal__form} onSubmit={showUserNameInput ? handleRegister : handleSubmit}>
          <label className={s.modal__label}>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className={s.modal__label}>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {showUserNameInput && (
            <label className={s.modal__label}>
              User Name:
              <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </label>
          )}
          <button type="submit" disabled={authStatus === 'loading'}>
            {showUserNameInput ? 'Register' : 'Submit'}
          </button>
        </form>
        {error && <p className={s.modal__error}>{error}</p>}
      </div>
    </div>
  )
}
