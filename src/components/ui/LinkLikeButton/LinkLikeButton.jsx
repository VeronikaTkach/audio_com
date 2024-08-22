import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import s from './styles.module.scss';

export const LinkLikeButton = ({ label, to, className, ...props }) => {
  return (
    <Link to={to} className={`${s.button} ${className}`} {...props}>
      {label}
    </Link>
  );
};

LinkLikeButton.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
};