import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';
import { Portal } from '../../Portal';
import s from './styles.module.scss';

export const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <Portal>
      <div className={s.modal}>
        <div className={s.modal__content}>
          <p style={{color: '#252f3f'}}>Are you sure you want to delete?</p>
          <div className={s.modal__actions}>
            <Button style={{backgroundColor: "red"}} label="Yes!" onClick={onConfirm}/>
            <Button label="Cancel" onClick={onCancel}/>
          </div>
        </div>
      </div>
    </Portal>
  );
};

ConfirmDeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
