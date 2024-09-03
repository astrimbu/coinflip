import React from 'react';

const NavigationArrow = ({ direction, onClick, disabled }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      [direction === 'left' ? 'left' : 'right']: '10px',
      transform: 'translateY(-50%)',
      zIndex: 10,
    }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          fontSize: '50px',
          fontFamily: 'monospace',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          background: 'transparent',
          color: disabled ? '#a9a9a9' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          padding: '0',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {direction === 'left' ? '←' : '→'}
      </button>
    </div>
  );
};

export default NavigationArrow;