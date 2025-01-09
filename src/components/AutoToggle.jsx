import React from 'react';

const AutoToggle = ({ isEnabled, onToggle, isUnlocked }) => {
  if (!isUnlocked) return null;
  
  return (
    <div 
      onClick={onToggle}
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isEnabled ? '#4CAF50' : '#666',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '12px',
        fontFamily: 'monospace',
        userSelect: 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{ 
        fontSize: '16px',
        opacity: isEnabled ? 1 : 0.5 
      }}>
        🤖
      </span>
      AUTO {isEnabled ? 'ON' : 'OFF'}
    </div>
  );
};

export default AutoToggle;
