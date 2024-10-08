import React from 'react';

const TutorialCompletionCertificate = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '45%',
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
      <h2 style={{ marginBottom: 0 }}>Congratulations!</h2>
      <p style={{ margin: 0 }}>You've completed the basic tutorial.</p>
      <p style={{ margin: 0, fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Go forth and click some monsters!</p>
      <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>Other important tips:</p>
      <ul style={{ textAlign: 'left', fontSize: '11px' }}>
        <li>There's good stuff in the Shop</li>
        <li>You can always fast-travel to Town</li>
        <li>Recycle dupes to upgrade equipment</li>
        <li>Arrows navigate between monsters</li>
      </ul>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
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