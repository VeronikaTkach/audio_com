import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, registerUser } from "../../core/store/userSlice";
import s from './styles.module.scss';

export const Authentification = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();
  const { authStatus, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const user = await dispatch(registerUser({ email, password })).unwrap();
        if (user) {
          console.log('Регистрация успешна');
          onClose();
        }
      } else {
        const user = await dispatch(fetchUser({ email, password })).unwrap();
        if (user) {
          console.log('Вы вошли в профиль');
          onClose();
        }
      }
    } catch (error) {
      console.error('Ошибка при аутентификации пользователя:', error);
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <span className={s.modal__close} onClick={onClose}>&times;</span>
        <div className={s.modal__title}>{isRegister ? 'Sign Up' : 'Log In'}</div>
        <form className={s.modal__form} onSubmit={handleSubmit}>
          <label className={s.modal__label}>
            Email:
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className={s.modal__label}>
            Password:
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" disabled={authStatus === 'loading'}>
            {isRegister ? 'Register' : 'Submit'}
          </button>
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Switch to Log In' : 'Switch to Sign Up'}
          </button>
        </form>
        {error && <p className={s.modal__error}>{error}</p>}
      </div>
    </div>
  )
}
