import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';
import { Portal } from '../../Portal';
import s from './styles.module.scss';

export const ConfirmCancelModal = ({ onConfirm, onCancel }) => {
  return (
    <Portal>
      <div className={s.modal}>
        <div className={s.modal__content}>
          <p style={{color: '#252f3f'}}>You have unsaved changes. <br/> Do you want to stay on the page or return to the catalog?</p>
          <div className={s.modal__actions}>
            <Button label="Stay" onClick={onCancel}/>
            <Button label="Catalog" onClick={onConfirm}/>
          </div>
        </div>
      </div>
    </Portal>
  );
};

ConfirmCancelModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};