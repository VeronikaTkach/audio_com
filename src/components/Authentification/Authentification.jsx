import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchUser, registerUser } from "../../core/store/userSlice";
import { Button } from "../ui/Button/Button";
import s from './styles.module.scss';

export const Authentification = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { authStatus, error } = useSelector((state) => state.user);

  const [customError, setCustomError] = useState(null);

  const from = location.state?.from?.pathname || "/catalog";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setCustomError(null);
      if (isRegister) {
        const user = await dispatch(registerUser({ email, password })).unwrap();
        if (user) {
          toast.success('Registration successful!');
          navigate(from, { replace: true });
        }
      } else {
        const user = await dispatch(fetchUser({ email, password })).unwrap();
        if (user) {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      if (isRegister && error.message.includes('23505')) {
        setCustomError('User already exists');
      } else {
        setCustomError('Authentication error');
      }
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.modal__backgroundText}>Audio.com</div>
      <div className={s.modal__content}>
        <button className={s.modal__close} onClick={onClose}>&times;</button>
        <div className={s.modal__title}>{isRegister ? 'Sign Up' : 'Log In'}</div>
        <form className={s.modal__form} onSubmit={handleSubmit}>
          <label className={s.modal__label}>
            Email:
            <input style={{maxWidth:'200px'}} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className={s.modal__label}>
            Password:
            <input style={{maxWidth:'200px'}}  type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <Button
            style={{maxWidth:'320px'}}
            type="submit"
            disabled={authStatus === 'loading'}
            label={isRegister ? 'Register' : 'Submit'}
          />
          <Button
            style={{maxWidth:'320px'}}
            type="submit"
            onClick={() => setIsRegister(!isRegister)}
            label={isRegister ? 'Switch to Log In' : 'Switch to Sign Up'}
          />
        </form>
        {customError && <p className={s.modal__error}>{customError}</p>}
        {error && <p className={s.modal__error}>{error}</p>}
      </div>
    </div>
  )
}
