import React, { useState, useEffect } from 'react';

const Confetti = ({ active, difficulty }) => {
  if (!active) return null;

  const confettiCount = {
    easy: 10,
    medium: 50,
    hard: 100,
    impossible: 200,
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

const InventoryGrid = ({ items, onEquip }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const itemImages = {
    Sword: {
      Common: '/api/placeholder/50/50?text=CS',
      Magic: '/api/placeholder/50/50?text=MS',
      Rare: '/api/placeholder/50/50?text=RS',
      Unique: '/api/placeholder/50/50?text=US',
    },
    Hat: {
      Common: '/api/placeholder/50/50?text=CH',
      Magic: '/api/placeholder/50/50?text=MH',
      Rare: '/api/placeholder/50/50?text=RH',
      Unique: '/api/placeholder/50/50?text=UH',
    },
  }; 

  const flattenedItems = Object.entries(items).flatMap(([itemName, rarities]) =>
    Object.entries(rarities).map(([rarity, count]) =>
      Array (count).fill({ name: itemName, rarity })
    )
  ).flat().slice(0, 16);

  return (
    <div style={{
      width: '360px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
       
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 50px)',
        gridGap: '10px',
      }}>
        {[...Array(16)].map((_, index) => (
        <div
          key={index}
          style={{
            width: '50px',
            height: '50px',
            border: '1px solid #ccc',
            position: 'relative'
          }}
          onClick={() => flattenedItems[index] && onEquip(flattenedItems[index])}
        >
          {flattenedItems[index] && (
            <>
              <img
                src={itemImages[flattenedItems[index].name][flattenedItems[index].rarity] || '/api/placeholder/50/50?text=?'}
                alt={flattenedItems[index].rarity + ' ' + flattenedItems[index].name}
                style={{ width: '100%', height: '100%' }}
                onMouseEnter={() => setHoveredItem(flattenedItems[index])}
                onMouseLeave={() => setHoveredItem(null)}
              />
              {hoveredItem === flattenedItems[index] && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  {`${flattenedItems[index].name} (${flattenedItems[index].rarity})`}
                </div>
              )}
            </>
          )}
        </div>
      ))}
      </div>
    </div>
    </div>
  )
}

const WornEquipment = ({ equipment, onUnequip, potions, gold }) => {
  return (
    <div style={{
      width: '360px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateRows: 'auto auto',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <p>Hat</p>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid #ccc',
              position: 'relative'
            }}
            onClick={() => equipment.hat && onUnequip('hat')}
          >
            {equipment.hat && (
              <img
                src={`/api/placeholder/50/50?text=${equipment.hat.rarity[0]}H`}
                alt="Hat"
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
        <div>
          <p>Sword</p>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid #ccc',
              position: 'relative'
            }}
            onClick={() => equipment.sword && onUnequip('sword')}
          >
            {equipment.sword && (
              <img
                src={`/api/placeholder/50/50?text=${equipment.sword.rarity[0]}S`}
                alt="Sword"
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <p>Gold</p>
          <div style={{
            width: '50px',
            height: '50px',
            border: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {equipment.gold || 0}
          </div>
        </div>
        <div>
          <p>Potion</p>
          <div style={{
            width: '50px',
            height: '50px',
            border: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {equipment.potions || 0}
          </div>
        </div>
      </div>
     </div> 
  )
}

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

  const [view, setView] = useState('game'); // 'game' or 'inventory'

  const [wornEquipment, setWornEquipment] = useState({
    hat: null,
    sword: null,
    gold: 0,
    potions: 0,
  });

  const [inventory, setInventory] = useState({
    Sword: { Common: 0, Magic: 0, Rare: 0, Unique: 0 },
    Hat: { Common: 0, Magic: 0, Rare: 0, Unique: 0 },
  });

  const [lastObtainedItem, setLastObtainedItem] = useState(null);

  const [recentItems, setRecentItems] = useState([]);

  const currentScore = scores[difficulty];
  const winRate = currentScore.flips > 0 ? (currentScore.wins / currentScore.flips * 100).toFixed(2) : 0;
  const targetRate = (difficultyLevels[difficulty].rate * 100).toFixed(2);

  const difficultyModifiers = {
    easy: 1,
    medium: 2,
    hard: 3,
    impossible: 5,
  };

  const rarityByDifficulty = {
    easy: 'Common',
    medium: 'Magic',
    hard: 'Rare',
    impossible: 'Unique',
  }

  const equipItem = (item) => {
    if (item.name === 'Hat' || item.name === 'Sword') {
      setWornEquipment(prev => {
        const slot = item.name.toLowerCase();
        const prevItem = prev[slot];
        
        // Remove item from inventory
        setInventory(prevInv => ({
          ...prevInv,
          [item.name]: {
            ...prevInv[item.name],
            [item.rarity]: prevInv[item.name][item.rarity] - 1
          }
        }));

        // If there was a previous item, add it back to inventory
        if (prevItem) {
          setInventory(prevInv => ({
            ...prevInv,
            [prevItem.name]: {
              ...prevInv[prevItem.name],
              [prevItem.rarity]: prevInv[prevItem.name][prevItem.rarity] + 1
            }
          }));
        }

        return { ...prev, [slot]: item };
      });
    }
  };

  const unequipItem = (slot) => {
    const item = wornEquipment[slot];
    if (item) {
      setWornEquipment(prev => ({ ...prev, [slot]: null}));
      setInventory(prevInv => ({
        ...prevInv,
        [item.name]: {
          ...prevInv[item.name],
          [item.rarity]: prevInv[item.name][item.rarity] + 1
        }
      }));
    }
  };

  const checkForItem = () => {
    const baseChance = 0.1;
    const modifier = difficultyModifiers[difficulty];
    const itemChance = baseChance * modifier;
    
    if (Math.random() < itemChance) {
      const items = ['Gold', 'Sword', 'Hat', 'Potion'];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const rarity = rarityByDifficulty[difficulty];

      const newItem = { name: randomItem, rarity };

      if (randomItem === 'Gold') {
        setWornEquipment(prev => ({ ...prev, gold: (prev.gold || 0) + 1 }));
      } else if (randomItem === 'Potion') {
        setWornEquipment(prev => ({ ...prev, potions: (prev.potions || 0) + 1}));
      } else {
        setInventory(prevInventory => ({
          ...prevInventory,
          [randomItem]: {
            ...prevInventory[randomItem],
            [rarity]: prevInventory[randomItem][rarity] + 1
          }
        }));
      }
    

      setLastObtainedItem(newItem);
      setMessage(`You found a ${rarity} ${randomItem}!`);

      setRecentItems(prev => [newItem, ...prev.slice(0, 4)]);
    } else {
      setLastObtainedItem(null);
    }
  };

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
        checkForItem();
      } else {
        setMessage('You lost. Maybe buy our "Luck Boost" DLC?');
      }
      setIsFlipping(false);
    }, 1000);
  };

  return (
    <div style={{ width: '420px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setView('game')} style={{ marginRight: '10px' }}>Game</button>
        <button onClick={() => setView('inventory')} style={{ marginRight: '10px' }}>Inventory</button>
        <button onClick={() => setView('equipment')}>Equipment</button>
      </div>
      
      {view === 'game' && (
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
            <h3>Recently Obtained Items:</h3>
            {recentItems.length > 0 ? (
              <ul>
                {recentItems.map((item, index) => (
                  <li key={index}>{`${item.rarity} ${item.name}`}</li>
                ))}
              </ul>
            ) : (
              <p>No items obtained yet.</p>
            )}
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

        </div>
      )}

      {view === 'inventory' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}>
          <InventoryGrid items={inventory} onEquip={equipItem} />
        </div>
      )}

      {view === 'equipment' && (
        <WornEquipment 
          equipment={wornEquipment}
          onUnequip={unequipItem}
        />
      )}

      <Confetti active={showConfetti} difficulty={difficulty} />
    </div>
  );
};

export default CoinFlipMMORPG;
