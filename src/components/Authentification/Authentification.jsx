import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUser, registerUser } from "../../core/store/userSlice";
import s from './styles.module.scss';

export const Authentification = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { authStatus, error } = useSelector((state) => state.user);

  const from = location.state?.from?.pathname || "/catalog";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const user = await dispatch(registerUser({ email, password })).unwrap();
        if (user) {
          console.log('Регистрация успешна');
          alert('Registration successful!');
          navigate(from, { replace: true });
        }
      } else {
        const user = await dispatch(fetchUser({ email, password })).unwrap();
        if (user) {
          console.log('Вы вошли в профиль');
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Ошибка при аутентификации пользователя:', error);
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
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
