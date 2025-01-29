import React, { useState, useRef } from 'react';
import { clearGameState, exportGameState, importGameState } from '../utils/storage';

const Settings = ({ onClose }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  const handleReset = () => {
    setShowConfirmation(true);
  };

  const confirmReset = () => {
    clearGameState();
    window.location.reload();
  };

  const handleExport = () => {
    exportGameState();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importGameState(file);
      window.location.reload();
    } catch (error) {
      setImportError('Failed to import save file. Please ensure it is valid.');
      setTimeout(() => setImportError(null), 3000);
    }
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    width: '150px',
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

        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button onClick={handleExport} style={buttonStyle}>
            💾 Save
          </button>
          
          <button onClick={handleImportClick} style={buttonStyle}>
            📂 Load
          </button>
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImportChange}
            accept=".json"
            style={{ display: 'none' }}
          />
          
          <button
            onClick={handleReset}
            style={{...buttonStyle, backgroundColor: '#ff4444'}}
          >
            🚮 Reset
          </button>

          {importError && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {importError}
            </div>
          )}
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