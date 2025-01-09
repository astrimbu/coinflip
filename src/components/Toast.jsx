const Toast = ({ message, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'fadeInOut 5s ease forwards',
      }}
    >
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            5% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>
      {message}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          marginLeft: '10px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default Toast; 