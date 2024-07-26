import React, { useState, useEffect } from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const CoinFlipMMORPG = () => {
  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1/2 },
    medium: { label: 'Medium', rate: 1/5 },
    hard: { label: 'Hard', rate: 1/20 },
    impossible: { label: 'Impossible', rate: 1/100 }
  };

  const [flips, setFlips] = useState(0);
  const [wins, setWins] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [isFlipping, setIsFlipping] = useState(false);
  const [message, setMessage] = useState('');

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const result = Math.random() < difficultyLevels[difficulty].rate;
      setFlips(prev => prev + 1);
      if (result) {
        setWins(prev => prev + 1);
        setMessage('You won! The RNG gods smile upon you.');
      } else {
        setMessage('You lost. Maybe buy our "Luck Boost" DLC?');
      }
      setIsFlipping(false);
    }, 1000);
  };

  useEffect(() => {
    if (wins === 1) {
      setMessage('First win! Only 999 more for the "Devoted Flipper" achievement!');
    } else if (flips % 100 === 0 && flips > 0) {
      setMessage(`Wow! You've flipped ${flips} times! Your life must be so fulfilling.`);
    }
  }, [flips, wins]);

  const winRate = flips > 0 ? (wins / flips * 100).toFixed(2) : 0;
  const targetRate = (difficultyLevels[difficulty].rate * 100).toFixed(2);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
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
        <p>Flips: {flips} | Wins: {wins}</p>
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
    </div>
  );
};

const WrappedCoinFlipMMORPG = () => (
  <ErrorBoundary>
    <CoinFlipMMORPG />
  </ErrorBoundary>
);

export default WrappedCoinFlipMMORPG;
