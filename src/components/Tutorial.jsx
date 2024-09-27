import React from 'react';

const Tutorial = ({ step, onSkip, positions }) => {
  const steps = [
    "Click on the monster to fight",
    "Fighting...",
    "You got a new item! Click it to equip",
    "Click the potion to boost your damage",
    "Go to Town by clicking the house icon",
    "Return to the game by clicking the Monster icon",
  ];

  if (step >= steps.length) {
    return null;
  }

  const getStyle = (position) => {
    const baseStyle = {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '10px',
      maxWidth: '20%',
      textAlign: 'center',
      zIndex: 1000,
    };

    if (position) {
      return { ...baseStyle, ...position };
    }

    return {
      ...baseStyle,
      top: 'calc(50% + 90px)',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <>
      <div style={getStyle(positions.main)}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={onSkip}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '0px 0px',
            }}
          >
            ✖
          </button>
          <p style={{ fontSize: '12px', padding: '0 14px 0 0', margin: '0' }}>{steps[step]}</p>
        </div>
        {step === 0 && (
          <button onClick={onSkip} style={{ fontSize: '10px', padding: '5px' }}>
            Skip Tutorial
          </button>
        )}
      </div>
      {positions.additional && positions.additional.map((pos, index) => (
        <div key={index} style={getStyle(pos)}>
          <p style={{ fontSize: '10px', padding: '0', margin: '5px' }}>{pos.text}</p>
        </div>
      ))}
    </>
  );
};

export default Tutorial;