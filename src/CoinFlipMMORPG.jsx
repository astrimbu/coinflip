import React, { useState, useEffect } from 'react';

const Confetti = ({ active, difficulty }) => {
  const [isActive, setIsActive] = useState(false);
  const [confettiItems, setConfettiItems] = useState([]);

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      const confettiCount = {
        easy: 10,
        medium: 50,
        hard: 100,
        impossible: 200,
      }[difficulty];

      const newConfettiItems = [...Array(confettiCount)].map(() => ({
        left: `${Math.random() * 100}%`,
        animationDuration: 3 + Math.random() * 2,
        color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
      }));

      setConfettiItems(newConfettiItems);

      const timer = setTimeout(() => {
        setIsActive(false);
        setConfettiItems([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, difficulty]);

  if (!isActive) return null;

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
      {confettiItems.map((item, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: item.left,
          top: '-20px',
          width: '10px',
          height: '10px',
          backgroundColor: item.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
          opacity: Math.random(),
          animation: `confetti-fall ${item.animationDuration}s ease-out forwards`,
        }} />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
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

const InventoryGrid = ({ items, onEquip, onUsePotion }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const itemImages = {
    Weapon: {
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
    Crystal: '/api/placeholder/50/50?text=CR',
  }; 

  const flattenedItems = Object.entries(items)
    .filter(([itemName]) => itemName !== 'Gold' && itemName !== 'Potion')
    .flatMap(([itemName, itemArray]) =>
      Array.isArray(itemArray) ? itemArray : []
    )
    .slice(0, 16);

    return (
      <div style={{
        width: '360px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '10px',
        }}>
          <div style={{ border: '1px solid #ccc', padding: '5px', textAlign: 'center' }}>
            Gold: {(items.Gold)}
          </div>
          <div 
            style={{ 
              border: '1px solid #ccc', 
              padding: '5px', 
              textAlign: 'center', 
              cursor: items.Potion > 0 ? 'pointer' : 'default',
              opacity: items.Potion > 0 ? 1 : 0.5,
            }}
            onClick={() => items.Potion > 0 && onUsePotion()}
          >
            Potions: {(items.Potion)}
          </div>
        </div>
      <hr style={{ width: '100%', margin: '10px 0' }} />
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
                src={itemImages[flattenedItems[index].name] || '/api/placeholder/50/50?text=?'}
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
  )
};

const WornEquipment = ({ equipment, onUnequip }) => {
  const slots = ['hat', 'cape', 'amulet', 'weapon', 'body', 'pants', 'gloves', 'boots', 'ring'];
  
  const calculateTotalStats = () => {
    return slots.reduce((total, slot) => {
      if (equipment[slot] && equipment[slot].stat) {
        return total + equipment[slot].stat;
      }
      return total;
    }, 0);
  };

  const [hoveredItem, setHoveredItem] = useState(null);

  function renderSlot(slot) {
    return (
      <div>
        <div
          style={{
            width: '50px',
            height: '50px',
            border: '1px solid #ccc',
            position: 'relative',
            margin: '0 auto',
          }}
          onClick={() => equipment[slot] && onUnequip(slot)}
          onMouseEnter={() => setHoveredItem(equipment[slot])}
          onMouseLeave={() => setHoveredItem(null)}
          title={slot.charAt(0).toUpperCase() + slot.slice(1)}
        >
          {equipment[slot] && (
            <img
              src={`/api/placeholder/50/50?text=${slot[0].toUpperCase()}`}
              alt={`${equipment[slot].rarity} ${equipment[slot].name}`}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {hoveredItem === equipment[slot] && equipment[slot] && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '5px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
            }}>
              {`${equipment[slot].rarity} ${equipment[slot].name}\nStat: ${equipment[slot].stat}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '360px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      padding: '50px 20px 20px 20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
    }}>
      <div style={{ gridColumn: '2' }}>{renderSlot('hat')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('cape')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('amulet')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('weapon')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('body')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('pants')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('gloves')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('boots')}</div>
      <div style={{ gridColumn: '3' }}>{renderSlot('ring')}</div>

      <div style={{ gridColumn: '1 / span 3' }}>
        <h3>Total Stats: {calculateTotalStats()}</h3>
      </div>
    </div>
  );
};

const Shop = ({ gold, inventorySlots, onPurchase }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
    }}>
      <h2>Shop</h2>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
      }}>
        <div>
          <img src="/api/placeholder/50/50?text=Crystal" alt="Crystal" />
          <p>Crystal (1 Gold)</p>
        </div>
        <button onClick={() => onPurchase('Crystal')} disabled={gold < 1}>
          Buy
        </button>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
      }}>
        <div>
          <img src="/api/placeholder/50/50?text=Potion" alt="Potion" />
          <p>Potion (1 Gold)</p>
        </div>
        <button onClick={() => onPurchase('Potion')} disabled={gold < 1}>
          Buy
        </button>
      </div>
    </div>
  );
}; 

const Recycler = ({ inventory, scrap, setScrap, onRecycle, onExchange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [exchangeRarity, setExchangeRarity] = useState('Common');
  const [exchangeItem, setExchangeItem] = useState('');
  const validEquipmentTypes = ['Weapon', 'Hat', 'Cape', 'Body', 'Pants', 
    'Gloves', 'Boots', 'Ring', 'Amulet'];

  const handleRecycle = () => {
    const recycledScrap = selectedItems.reduce((acc, item) => {
      acc[item.rarity] = (acc[item.rarity] || 0) + 1;
      return acc;
    }, {});
    setScrap(prevScrap => {
      const newScrap = { ...prevScrap };
      Object.keys(recycledScrap).forEach(rarity => {
        newScrap[rarity] = (newScrap[rarity] || 0) + recycledScrap[rarity];
      });
      return newScrap;
    });
    onRecycle(selectedItems);
    setSelectedItems([]);
  };

  const handleRecycleAll = () => {
    const recycledScrap = Object.entries(inventory)
      .filter(([category]) => category !== 'Gold' && category !== 'Potion' && category !== 'Crystal')
      .flatMap(([category, items]) => Array.isArray(items) ? items.filter(item => item.rarity) : []);
    setScrap(prevScrap => {
      const newScrap = { ...prevScrap };
      Object.values(recycledScrap).forEach(item => {
        const rarity = item['rarity']
        newScrap[rarity] = (newScrap[rarity] || 0) + 1;
      });
      return newScrap;
    });
    onRecycle(recycledScrap);
  };

  const handleExchange = () => {
    if (scrap[exchangeRarity] >= 2 && exchangeItem && validEquipmentTypes.includes(exchangeItem)) {
      setScrap(prevScrap => ({ ...prevScrap, [exchangeRarity]: prevScrap[exchangeRarity] - 2 }));
      onExchange(exchangeRarity, exchangeItem);
      setExchangeItem('');
    }
  };

  const recyclableItems = Object.entries(inventory)
    .filter(([category]) => category !== 'Gold' && category !== 'Potion' && category !== 'Crystal')
    .flatMap(([category, items]) => 
    Array.isArray(items) ? items.filter(item => item.rarity) : []
  );

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <h2>Recycler</h2>
      <div>
        <h3>Select items to recycle:</h3>
        {recyclableItems.map((item, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => {
                if (selectedItems.includes(item)) {
                  setSelectedItems(selectedItems.filter(i => i !== item));
                } else {
                  setSelectedItems([...selectedItems, item]);
                }
              }}
            />
            {item.rarity} {item.name}
          </label>
        ))}
        <button onClick={handleRecycle} disabled={selectedItems.length === 0}>Recycle</button>
        <button onClick={handleRecycleAll} disabled={recyclableItems.length === 0}>Recycle All</button>
      </div>
      <div>
        <h3>Scrap:</h3>
        {Object.entries(scrap).map(([rarity, count]) => (
          <p key={rarity}>{rarity}: {count}</p>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Exchange Scrap:</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <select 
            value={exchangeRarity} 
            onChange={(e) => setExchangeRarity(e.target.value)}
            style={{ padding: '5px', borderRadius: '3px' }}
          >
            {Object.keys(scrap).map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
          <select
            value={exchangeItem}
            onChange={(e) => setExchangeItem(e.target.value)}
            style={{ padding: '5px', borderRadius: '3px' }}
          >
            <option value="">Select item type</option>
            {validEquipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button 
            onClick={handleExchange} 
            disabled={scrap[exchangeRarity] < 2 || !exchangeItem}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: scrap[exchangeRarity] < 2 || !exchangeItem ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: scrap[exchangeRarity] < 2 || !exchangeItem ? 'not-allowed' : 'pointer',
            }}
          >
            Exchange
          </button>
        </div>
        <p>Cost: 2 {exchangeRarity} scrap</p>
      </div>
    </div>
  );
};

const CoinFlipMMORPG = () => {
  const [wornEquipment, setWornEquipment] = useState({
    hat: null,
    weapon: null,
    cape: null,
    body: null,
    pants: null,
    gloves: null,
    boots: null,
    ring: null,
    amulet: null,
  });
  const [inventory, setInventory] = useState({
    Weapon: [],
    Hat: [],
    Cape: [],
    Body: [],
    Pants: [],
    Gloves: [],
    Boots: [],
    Ring: [],
    Amulet: [],
    Crystal: [],
    Gold: 1,
    Potion: 1,
  });
  const [scrap, setScrap] = useState({ Common: 0, Magic: 0, Rare: 0, Unique: 0 });



  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1/2, color: '#4CAF50' },
    medium: { label: 'Medium', rate: 1/3, color: '#FFA500' },
    hard: { label: 'Hard', rate: 1/100, color: '#F44336' },
    impossible: { label: 'Impossible', rate: 1/1000, color: '#9C27B0' }
  };
  const difficultyModifiers = { easy: 2, medium: 3, hard: 4, impossible: 5 };
  const rarityByDifficulty = { 
    easy: 'Common', 
    medium: 'Magic', 
    hard: 'Rare', 
    impossible: 'Unique', 
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
  const [crystalTimer, setCrystalTimer] = useState(0);
  
  const [lastObtainedItem, setLastObtainedItem] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const currentScore = scores[difficulty];
  const [potionTimer, setPotionTimer] = useState(0);
  const inventorySlots = 16;

  const getRarityStat = (rarity) => {
    switch (rarity) {
      case 'Common': return 1;
      case 'Magic': return 2;
      case 'Rare': return 3;
      case 'Unique': return 5;
      default: return 0;
    }
  };

  const calculateTotalStats = () => {
    return Object.values(wornEquipment).reduce((total, item) => {
      return total + (item && item.stat ? item.stat : 0);
    }, 0);
  };

  const purchaseItem = (item) => {
    if (item === 'Crystal' && inventory.Gold >= 1) {
      setInventory(prev => ({
        ...prev,
        Gold: prev.Gold - 1,
        Crystal: [...prev.Crystal, { name: 'Crystal', rarity: 'Crystal' }]
      }));
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Potion' && inventory.Gold >= 1) {
      setInventory(prev => ({
        ...prev,
        Gold: prev.Gold - 1,
        Potion: prev.Potion + 1
      }));
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    }
  };

  const useItem = (item) => {
    if (item.name === 'Crystal') {
      setInventory(prev => ({
        ...prev,
        Crystal: prev.Crystal.slice(1)
      }));
      setCrystalTimer(300);
    } else if (item.name === 'Potion') {
      setInventory(prev => ({
        ...prev,
        Potion: prev.Potion - 1
      }));
      setPotionTimer(300);
    }
  };

  const usePotion = () => {
    if (inventory.Potion > 0) {
      setInventory(prev => ({
        ...prev,
        Potion: prev.Potion - 1
      }));
      setPotionTimer(20);
    }
  };

  const calculateWinRate = () => {
    const totalStats = calculateTotalStats();
    const statBonus = Math.floor(totalStats / 6) + totalStats * 0.1;
    const baseRate = difficultyLevels[difficulty].rate;
    return Math.min(baseRate * Math.pow(2, statBonus), 1);
  };

  const calculateItemDropRate = () => {
    const baseChance = 0.1;
    const modifier = difficultyModifiers[difficulty];
    return (baseChance * modifier * (crystalTimer > 0 ? 2 : 1) * 100).toFixed(2);
  };

  const handleRecycle = (items) => {
    items.forEach(item => {
      const category = item.name;
      setInventory(prev => ({
        ...prev,
        [category]: prev[category].filter(i => i !== item)
      }));
      setScrap(prev => ({
        ...prev,
        [item.rarity]: prev[item.rarity] + 1
      }));
    });
  };

  const handleExchange = (rarity, itemName) => {
    setScrap(prev => ({ ...prev, [rarity]: prev[rarity] - 2 }));
    setInventory(prev => ({
      ...prev,
      [itemName]: [...prev[itemName] || '', { name: itemName, rarity, stat: getRarityStat(rarity) }]
    }));
  };

  const checkInventoryFull = () => {
    const totalItems = Object.values(inventory).reduce((sum, items) => 
      sum + (Array.isArray(items) ? items.length : 0), 0);
    return totalItems >= inventorySlots;
  };

  const equipItem = (item) => {
    const slot = item.name.toLowerCase();

    setWornEquipment(prev => {
      const prevItem = prev[slot];
      
      // Remove item from inventory
      setInventory(prevInv => {
        const category = item.name;
        return {
          ...prevInv,
          [category]: prevInv[category].filter(i => i !== item)
        };
      });

      // If there was a previous item, add it back to inventory
      if (prevItem) {
        setInventory(prevInv => {
          const category = prevItem.name;
          return {
            ...prevInv,
            [category]: [...prevInv[category], prevItem]
          };
        });
      } 

      return { ...prev, [slot]: item };
    });
  };

  const unequipItem = (slot) => {
    const item = wornEquipment[slot];
    if (item) {
      if (slot === 'gold' || slot === 'potion') return;
      setWornEquipment(prev => ({ ...prev, [slot]: null }));
      setInventory(prevInv => {
        const category = item.name;
        return {
          ...prevInv,
          [category]: [...prevInv[category] || [], item]
        };
      });
    }
  };

  const checkForItem = () => {
    const baseChance = 0.1;
    const modifier = difficultyModifiers[difficulty];
    const itemChance = baseChance * modifier * (crystalTimer > 0 ? 2 : 1);
    
    if (Math.random() < itemChance) {
      const items = ['Gold', 'Weapon', 'Hat', 'Cape', 'Body', 'Pants', 'Gloves', 'Boots', 'Ring', 'Amulet', 'Potion'];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const rarity = rarityByDifficulty[difficulty];

      let newItem;
      const extraItems = {
        easy: 1,
        medium: 2,
        hard: 3,
        impossible: 4
      }[difficulty];

      if (randomItem === 'Gold' || randomItem === 'Potion') {
        setInventory(prev => ({
          ...prev,
          [randomItem]: prev[randomItem] + extraItems
        }));
        newItem = { name: randomItem, count: extraItems };
      } else {
        const stat = getRarityStat(rarity);
        newItem = { name: randomItem, rarity, stat };
        setInventory(prevInventory => ({
          ...prevInventory,
          [randomItem]: [...(prevInventory[randomItem] || []), newItem]
        }));
      }
      setLastObtainedItem(newItem);
      setMessage(`You found ${newItem.count ? newItem.count : 'a'} ${newItem.rarity ? `${newItem.rarity} ` : ''}
        ${newItem.name}${newItem.count > 1 && newItem.name !== 'Gold' ? 's' : ''}`
      );

      setRecentItems(prev => [newItem, ...prev.slice(0, 4)]);
    } else {
      setLastObtainedItem(null);
    } 
  }; 

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const totalStats = calculateTotalStats();
      const statBonus = Math.floor(totalStats / 6);
      const baseRate = difficultyLevels[difficulty].rate;
      const adjustedRate = Math.min(baseRate * Math.pow(2, statBonus), 1);
      const result = Math.random() < adjustedRate;

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
    }, potionTimer > 0 ? 10 : 1000);
  };

  useEffect(() => {
    let interval;
    if (crystalTimer > 0 || potionTimer > 0) {
      interval = setInterval(() => {
        if (crystalTimer > 0) {
          setCrystalTimer(prevTimer => prevTimer - 1);
        }
        if (potionTimer > 0) {
          setPotionTimer(prevTimer => prevTimer - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [crystalTimer, potionTimer]);

  return (
    <div style={{ width: '420px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setView('game')} style={{ marginRight: '10px' }}>Game</button>
        <button onClick={() => setView('inventory')} style={{ marginRight: '10px' }}>Inventory</button>
        <button onClick={() => setView('equipment')} style={{ marginRight: '10px' }}>Equipment</button>
        <button onClick={() => setView('shop')} style={{ marginRight: '10px' }}>Shop</button>
        <button onClick={() => setView('recycler')}>Recycler</button>
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

          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            {(calculateWinRate() * 100).toFixed(2)}% flip win
            <span> x </span>
            {calculateItemDropRate()}% item drop
          </div>

          {crystalTimer > 0 && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              Crystal Boost: {Math.floor(crystalTimer / 60)}:{(crystalTimer % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          {potionTimer > 0 && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              Potion Effect: {Math.floor(potionTimer / 60)}:{(potionTimer % 60).toString().padStart(2, '0')}
            </div>
          )}
      
          <div style={{ marginBottom: '16px' }}>
            <h3>Recently Obtained Items:</h3>
            {recentItems.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {recentItems.map((item, index) => (
                  <li key={index}>
                    {item.count ? `${item.count} ` : ''}
                    {item.rarity ? `${item.rarity} ` : ''}
                    {item.name}
                    {item.count > 1 ? 's' : ''}
                  </li>
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
            <p>Remember: It's not gambling if you always win!</p>
          </div>

        </div>
      )}

      {view === 'inventory' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}>
          <InventoryGrid 
            items={inventory}
            onEquip={(item) => {
              if (item.name === 'Crystal' || item.name === 'Potion') {
                useItem(item);
              } else {
                equipItem(item);
              }
            }}
            onUsePotion={usePotion}
          />
        </div>
      )}


      {view === 'equipment' && (
        <WornEquipment 
          equipment={wornEquipment}
          onUnequip={unequipItem}
        />
      )}

      {view === 'shop' && (
        <>
          <Shop 
            gold={inventory.Gold} 
            onPurchase={purchaseItem} 
          />
          {purchaseNotification && (
            <div style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              zIndex: 1000,
            }}>
              Purchase successful!
            </div>
          )}
        </>
      )}

      {view === 'recycler' && (
        <Recycler
          inventory={inventory}
          onRecycle={handleRecycle}
          onExchange={handleExchange}
          scrap={scrap}
          setScrap={setScrap}
        />
      )}

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        Version 1.0.0
      </div>

      <Confetti active={showConfetti} difficulty={difficulty} />
    </div>
  );
};

export default CoinFlipMMORPG;
