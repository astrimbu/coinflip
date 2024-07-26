import React, { useState, useEffect } from 'react';

const Confetti = ({ active }) => {
  if (!active) return null;

  const confettiCount = 150;
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      {[...Array(confettiCount)].map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = 3 + Math.random() * 2;
        const horizontalSpeed = 1 + Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div key={i} style={{
            position: 'absolute',
            left: left,
            top: '-20px',
            width: '10px',
            height: '10px',
            backgroundColor: color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            opacity: Math.random(),
            animation: `confetti-${i} ${animationDuration}s ease-out infinite`,
          }} />
        );
      })}
      <style>{`
        ${[...Array(confettiCount)].map((_, i) => `
          @keyframes confetti-${i} {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }
            100% {
              transform: translate3d(${(Math.random() - 0.5) * 500}px, ${window.innerHeight + 20}px, 0) rotate(${Math.random() * 720}deg);
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

const CoinFlipMMORPG = () => {
  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1/2, color: '#e6ffe6' },
    medium: { label: 'Medium', rate: 1/5, color: '#fff0e6' },
    hard: { label: 'Hard', rate: 1/20, color: '#ffe6e6' },
    impossible: { label: 'Impossible', rate: 1/100, color: '#e6e6ff' }
  };

  const [difficulty, setDifficulty] = useState('medium');
  const [scores, setScores] = useState({
    easy: { flips: 0, wins: 0 },
    medium: { flips: 0, wins: 0 },
    hard: { flips: 0, wins: 0 },
    impossible: { flips: 0, wins: 0 }
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const result = Math.random() < difficultyLevels[difficulty].rate;
      setScores(prevScores => ({
        ...prevScores,
        [difficulty]: {
          flips: prevScores[difficulty].flips + 1,
          wins: prevScores[difficulty].wins + (result ? 1 : 0)
        }
      }));
      if (result) {
        setMessage('You won! The RNG gods smile upon you.');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setMessage('You lost. Maybe buy our "Luck Boost" DLC?');
      }
      setIsFlipping(false);
    }, 1000);
  };

  useEffect(() => {
    const currentScore = scores[difficulty];
    if (currentScore.wins === 1) {
      setMessage('First win! Only 999 more for the "Devoted Flipper" achievement!');
    } else if (currentScore.flips % 100 === 0 && currentScore.flips > 0) {
      setMessage(`Wow! You've flipped ${currentScore.flips} times on ${difficultyLevels[difficulty].label}! Your life must be so fulfilling.`);
    }
  }, [scores, difficulty]);

  const currentScore = scores[difficulty];
  const winRate = currentScore.flips > 0 ? (currentScore.wins / currentScore.flips * 100).toFixed(2) : 0;
  const targetRate = (difficultyLevels[difficulty].rate * 100).toFixed(2);

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px', 
      backgroundColor: difficultyLevels[difficulty].color, 
      borderRadius: '8px',
      transition: 'background-color 0.3s ease'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>CoinFlip Legends: The Flippening</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <label>Select difficulty level:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '8px' }}
        >
          {Object.entries(difficultyLevels).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={flipCoin} 
        disabled={isFlipping}
        style={{ width: '100%', padding: '8px', backgroundColor: isFlipping ? '#ccc' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
      
      <div style={{ marginTop: '16px' }}>
        <p>Flips: {currentScore.flips} | Wins: {currentScore.wins}</p>
        <p>Current Win Rate: {winRate}%</p>
        <p>Target Win Rate: {targetRate}%</p>
      </div>
      
      {message && (
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#FFF3CD', border: '1px solid #FFEEBA' }}>
          <p>{message}</p>
        </div>
      )}
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <p>Notice: Any resemblance to actual games is purely coincidental and definitely not a scathing commentary on the industry.</p>
        <p>Remember: It's not gambling if you always lose!</p>
      </div>

      <Confetti active={showConfetti} />
    </div>
  );
};

export default CoinFlipMMORPG;
