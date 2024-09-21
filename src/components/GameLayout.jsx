import React from 'react';

const GameLayout = ({ leftPanel, middlePanel, rightPanel, toggleSound, isSoundEnabled, inventoryBackground, equipmentBackground, overrideMobile }) => {
  return (
    <div id='renderGame'
      style={{
        width: '100%',
        margin: '0 auto',
        background: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <button
        onClick={toggleSound}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '0',
          zIndex: 1000,
        }}
      >
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ 
          width: '25%', 
          maxWidth: '200px', 
          paddingTop: '10px', 
          position: 'relative', 
          backgroundImage: `url('/coinflip/assets/backgrounds/${inventoryBackground}.png')`,
          backgroundSize: overrideMobile ? 'cover' : 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#111',
        }}>
          {leftPanel}
        </div>

        <div style={{ 
          width: '50%', 
          maxWidth: '400px', 
          height: '100%', // Take full height
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {middlePanel}
        </div>

        <div style={{
          width: '25%', 
          maxWidth: '200px', 
          paddingTop: '10px', 
          position: 'relative',
          backgroundImage: `url('/coinflip/assets/backgrounds/${equipmentBackground}.png')`,
          backgroundSize: overrideMobile ? 'cover' : 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#111',
        }}>
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

export default GameLayout;