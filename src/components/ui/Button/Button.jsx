import React from 'react';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const Button = ({ label, onClick, className, ...props }) => {
  return (
    <button onClick={onClick} className={`${s.button} ${className}`} {...props}>
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};
