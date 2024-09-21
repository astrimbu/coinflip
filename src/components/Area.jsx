import React from 'react';
import { getBackgroundImage } from '../utils';

const Area = ({ children, monster }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        backgroundImage: `url(/coinflip/assets/backgrounds/${getBackgroundImage(monster)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

export default Area;