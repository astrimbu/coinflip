import React from 'react';

const HealthBar = ({ current, max, isFlashing, isLowHP }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '23px',
      right: '10px',
      width: '120px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: '3px',
      borderRadius: '4px',
    }}>
      <div style={{
        width: '100%',
        height: '15px',
        backgroundColor: 'rgb(50, 50, 50)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          style={{
            width: `${(current / max) * 100}%`,
            height: '100%',
            backgroundColor: isLowHP ? '#ff4444' : '#44ff44',
            transition: 'width 0.3s ease-out',
            animation: isFlashing ? 'flashDamage 0.2s' : 'none',
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          whiteSpace: 'nowrap',
        }}>
          {current}/{max}
        </div>
      </div>
    </div>
  );
};

export default HealthBar;