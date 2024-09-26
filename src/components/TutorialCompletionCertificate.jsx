import React from 'react';

const TutorialCompletionCertificate = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      textAlign: 'center',
      maxWidth: '80%',
      zIndex: 1000,
    }}>
      <h2 style={{ marginTop: 0 }}>Congratulations!</h2>
      <p>You've completed the basic tutorial.</p>
      <p>You're now ready to explore the game on your own. Good luck!</p>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#111',
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default TutorialCompletionCertificate;