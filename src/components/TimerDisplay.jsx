import React from 'react';
import { getItemUrl } from '../utils';

const TimerDisplay = ({ crystalTimer, potionTimer }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        gap: '10px',
        zIndex: 10,
      }}
    >
      {crystalTimer > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f0f0f0' }}>
          <img
            src={getItemUrl('crystal', 'Crystal')}
            alt="Crystal"
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {Math.floor(crystalTimer / 60)}:
            {(crystalTimer % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}
      {potionTimer > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#f0f0f0' }}>
          <img
            src={getItemUrl('potion', 'Potion')}
            alt="Potion"
            style={{ width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {Math.floor(potionTimer / 60)}:
            {(potionTimer % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
