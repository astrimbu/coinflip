import React, { useState, useEffect } from 'react';

const Confetti = ({ active, difficulty }) => {
  if (!active) return null;

  const confettiCount = {
    easy: 50,
    medium: 100,
    hard: 200,
    impossible: 500
  }[difficulty];

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
              opacity: 1;
            }
            100% {
              transform: translate3d(${(Math.random() - 0.5) * 500}px, ${window.innerHeight + 20}px, 0) rotate(${Math.random() * 720}deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

const ProgressBar = ({ difficulty, scores, difficultyLevels }) => {
  const { wins, flips } = scores[difficulty];
  const { label, color } = difficultyLevels[difficulty];
  const progress = flips > 0 ? (wins / flips) * 100 : 0;

  return (
    <div style={{ 
      marginBottom: '8px', 
      padding: '8px', 
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '360px',
      height: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${progress}%`, 
        height: '100%',
        backgroundColor: color, 
        transition: 'width 0.3s ease-in-out',
        zIndex: 1,
      }} />
      <div style={{ zIndex: 2, color: 'black' }}>{label}:</div>
      <div style={{ zIndex: 2, color: 'black' }}>{wins}/{flips}</div>
    </div>
  );
};

const CoinFlipMMORPG = () => {
  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1/2, color: '#4CAF50' },
    medium: { label: 'Medium', rate: 1/3, color: '#FFA500' },
    hard: { label: 'Hard', rate: 1/5, color: '#F44336' },
    impossible: { label: 'Impossible', rate: 1/50, color: '#9C27B0' }
  };

  const [difficulty, setDifficulty] = useState('easy');
  const [scores, setScores] = useState({
    easy: { flips: 0, wins: 0 },
    medium: { flips: 0, wins: 0 },
    hard: { flips: 0, wins: 0 },
    impossible: { flips: 0, wins: 0 }
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [message, setMessage] = useState('Good luck!');
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
      setMessage('Only 999 more wins until "Devoted Flipper"!');
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
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>CoinFlip Legends: The Flippening</h1>
      
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(difficultyLevels).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setDifficulty(key)}
            variant={difficulty === key ? "default" : "outline"}
            style={{
              backgroundColor: difficulty === key ? color : 'transparent',
              color: difficulty === key ? 'white' : 'black',
              border: `1px solid ${color}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      
      <button 
        onClick={flipCoin} 
        disabled={isFlipping}
        style={{ width: '100%', marginBottom: '16px' }}
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
      
      <div style={{ marginBottom: '16px' }}>
        <p>Current Win Rate: {winRate}%</p>
        <p>Target Win Rate: {targetRate}%</p>
      </div>
      
      <div>
        <ProgressBar
          difficulty={difficulty} 
          scores={scores} 
          difficultyLevels={difficultyLevels} 
        />
      </div>
      
      {message && (
        <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#FFF3CD', border: '1px solid #FFEEBA' }}>
          <p>{message}</p>
        </div>
      )}
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
        <p>Notice: Any resemblance to actual games is purely coincidental.</p>
        <p>Remember: It's not gambling if you always lose!</p>
      </div>

      <Confetti active={showConfetti} difficulty={difficulty} />
    </div>
  );
};

export default CoinFlipMMORPG;
