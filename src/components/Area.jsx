import React from 'react';

const Area = ({ children, monster }) => {
  const getBackgroundImage = () => {
    switch (monster) {
      case 'Goblin':
        return 'forest.png';
      case 'Ogre':
        return 'dirt.png';
      case 'Demon':
        return 'hellscape.png';
      case 'Dragon':
        return 'wild.png';
      default:
        return 'forest.png';
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        backgroundImage: `url(${new URL(`../assets/backgrounds/${getBackgroundImage()}`, import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

export default Area;