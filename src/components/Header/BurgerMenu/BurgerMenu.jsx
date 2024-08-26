import React, { useState } from 'react';
import styled from 'styled-components';
import ThemeToggle from '../../../assets/styles/themes/ThemeToggle';

const BurgerIcon = styled.div`
  display: none;
  @media (max-width: 1020px) {
    display: block;
    cursor: pointer;
    width: 30px;
    height: 30px;
    position: relative;
    z-index: 1000;
  }
  & div {
    width: 30px;
    height: 3px;
    background-color: var(--text-color);
    margin: 5px 0;
    transition: 0.4s;
  }
`;

const SidePanel = styled.div`
  height: 40%;
  width: ${(props) => (props.open ? '250px' : '0')};
  position: fixed;
  top: 0;
  right: 0;
  background-color: var(--text-color);
  color: white;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  border-bottom-left-radius: 15px;
  z-index: 1000;

  a, button {
    padding: 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
  }

  a:hover, button:hover {
    color: #f1f1f1;
  }

  @media (min-width: 1021px) {
    display: none;
  }
`;

const CloseButton = styled.a`
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 36px;
  // margin-left: 30px;
  cursor: pointer;
`;

export const BurgerMenu = ({ user, handleNewAlbumClick, handleFavoritesClick, handleLogout, handleAuthClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleButtonClick = (action) => {
    action();
    setMenuOpen(false);
  };

  return (
    <>
      <BurgerIcon onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </BurgerIcon>

      <SidePanel open={menuOpen}>
        <CloseButton onClick={() => setMenuOpen(false)}>&times;</CloseButton>
        <ThemeToggle />
        {user ? (
          <div>
            {user.isEditor && (
              <button onClick={() => handleButtonClick(handleNewAlbumClick)}>
                Create New Album
              </button>
            )}
            <button onClick={() => handleButtonClick(handleFavoritesClick)}>
              Favorites
            </button>
            <button onClick={() => handleButtonClick(handleLogout)}>
              Log out
            </button>
          </div>
        ) : (
          <button onClick={() => handleButtonClick(handleAuthClick)}>
            Log in/ Sign in
          </button>
        )}
      </SidePanel>
    </>
  );
};
