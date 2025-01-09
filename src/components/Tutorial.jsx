import React from 'react';
import { TUTORIAL_STEPS } from '../constants/tutorialData';

const Tutorial = ({ step, onSkip, positions }) => {
  if (step >= TUTORIAL_STEPS.length) {
    return null;
  }

  const currentStep = TUTORIAL_STEPS[step];

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

    return baseStyle;
  };

  return (
    <>
      <div style={getStyle(currentStep.position.main)}>
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
          <p style={{ fontSize: '12px', padding: '0 14px 0 0', margin: '0' }}>
            {currentStep.text}
          </p>
        </div>
        {step === 0 && (
          <button 
            onClick={onSkip} 
            style={{ 
              fontSize: '12px', 
              padding: '5px 10px', 
              backgroundColor: '#9a9a9a' 
            }}
          >
            Skip Tutorial
          </button>
        )}
      </div>
      {currentStep.position.additional?.map((pos, index) => (
        <div key={index} style={getStyle(pos)}>
          <p style={{ fontSize: '12px', padding: '0', margin: '0' }}>
            {pos.text}
          </p>
        </div>
      ))}
    </>
  );
};

export default Tutorial;