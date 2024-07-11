import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <p>Are you sure you want to delete this album?</p>
        <div className={s.modal__actions}>
          <button onClick={onConfirm} className={s.modal__button}>Yes!</button>
          <button onClick={onCancel} className={s.modal__button}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

ConfirmDeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
