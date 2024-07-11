import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const ConfirmCancelModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={s.modal}>
      <div className={s.modal__content}>
        <p>You have unsaved changes. Do you want to stay on the page or return to the catalog?</p>
        <button onClick={onCancel} className={s.modal__button}>Stay</button>
        <button onClick={onConfirm} className={s.modal__button}>Catalog</button>
      </div>
    </div>
  );
};

ConfirmCancelModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};