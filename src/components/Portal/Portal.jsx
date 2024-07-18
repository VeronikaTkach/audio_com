import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({ children }) => {
  const portalRoot = document.getElementById('portal-root');
  const el = document.createElement('div');

  useEffect(() => {
    portalRoot.appendChild(el);
    return () => {
      portalRoot.removeChild(el);
    };
  }, [el, portalRoot]);

  return createPortal(children, el);
};
