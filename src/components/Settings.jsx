import React, { useState } from 'react';
import { clearGameState } from '../utils/storage';

const Settings = ({ onClose }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    clearGameState();
    window.location.reload();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '40px',
            cursor: 'pointer',
            padding: '5px',
            lineHeight: '1rem',
            color: '#333',
          }}
        >
          ×
        </button>

        <h2 style={{ marginTop: 0 }}>Settings</h2>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleReset}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Reset Game
          </button>
        </div>

        {showConfirmation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001,
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <h3>Are you sure?</h3>
              <p>This will permanently delete all your progress!</p>
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px',
              }}>
                <button
                  onClick={confirmReset}
                  style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  style={{
                    backgroundColor: '#ddd',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 