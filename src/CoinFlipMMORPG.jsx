/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useInventoryManager from './useInventoryManager';
import './hover.css';

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

const InventoryGrid = ({ items, onEquip, onUsePotion, onUseCrystal }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Magic': return '#3B88FF';
      case 'Rare': return '#F44336';
      case 'Unique': return '#000';
      default: return '#888';
    }
  };

  function getItemUrl (name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`./assets/items/${name}.png`, import.meta.url).href
    }
    return new URL(`./assets/items/${name}-${rarity}.png`, import.meta.url).href
  }

  const flattenedItems = Object.entries(items)
    .filter(([itemName]) => itemName !== 'Gold' && itemName !== 'Potion')
    .flatMap(([, itemArray]) =>
      Array.isArray(itemArray) ? itemArray : []
    )
    .slice(0, 16);

    return (
      <div style={{
        width: '200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 0 30px 0',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '10px',
        }}>
          <div style={{ border: '2px solid #aaa', padding: '5px', textAlign: 'center' }}>
            <img src={getItemUrl('gold')} alt="Gold" /> {(items.Gold)}
          </div>
          <div 
            style={{ 
              border: '2px solid #aaa', 
              padding: '5px', 
              textAlign: 'center', 
              cursor: items.Potion > 0 ? 'pointer' : 'default',
              opacity: items.Potion > 0 ? 1 : 0.5,
            }}
            onClick={() => items.Potion > 0 && onUsePotion()}
          >
            <img src={getItemUrl('potion')} alt="Potion" /> {(items.Potion)}
          </div>
        </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 50px)',
        gridGap: '4px',
      }}>
        {[...Array(16)].map((_, index) => (
        <div
          key={index}
          style={{
            width: '50px',
            height: '50px',
            border: '2px solid #ccc',
            position: 'relative',
            outline: flattenedItems[index] ? `2px solid ${getRarityColor(flattenedItems[index].rarity)}` : 'none',
            outlineOffset: '-2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => flattenedItems[index] && 
            (flattenedItems[index].name === 'Crystal' && onUseCrystal()) ||
            onEquip(flattenedItems[index], flattenedItems[index].name)
          }
        >
          {flattenedItems[index] && (
            <>
              <img
                src={getItemUrl(flattenedItems[index].name.toLowerCase(),
                  flattenedItems[index].rarity.toLowerCase())}
                alt={flattenedItems[index].rarity + ' ' + flattenedItems[index].name}
                style={{}}
                onMouseEnter={() => setHoveredItem(flattenedItems[index].name)}
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
  const slots = ['Hat', 'Cape', 'Amulet', 'Weapon', 'Body', 'Pants', 'Gloves', 'Boots', 'Ring'];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Magic': return '#3B88FF';
      case 'Rare': return '#F44336';
      case 'Unique': return '#000';
      default: return '#ccc';
    }
  };

  function getItemUrl (name, rarity) {
    name = name.toLowerCase()
    rarity = rarity.toLowerCase()
    return new URL(`./assets/items/${name}-${rarity}.png`, import.meta.url).href
  }
  
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
            position: 'relative',
            margin: '0 auto',
            outline: equipment[slot] ? `3px solid 
              ${getRarityColor(equipment[slot].rarity)}` : '2px solid #888',
            outlineOffset: '-2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => equipment[slot] && onUnequip(slot)}
          onMouseEnter={() => setHoveredItem(equipment[slot])}
          onMouseLeave={() => setHoveredItem(null)}
          title={slot.charAt(0).toUpperCase() + slot.slice(1)}
        >
          {equipment[slot] && (
            <img
              src={getItemUrl(equipment[slot].name, equipment[slot].rarity)}
              alt={`${equipment[slot].rarity} ${equipment[slot].name}`}
              style={{}}
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
              {`+${equipment[slot].stat} to Stats`}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '4px',
    }}>
      <div style={{ gridColumn: '2' }}>{renderSlot('Hat')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('Cape')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('Amulet')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('Weapon')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('Body')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('Pants')}</div>
      <div style={{ gridColumn: '1' }}>{renderSlot('Gloves')}</div>
      <div style={{ gridColumn: '2' }}>{renderSlot('Boots')}</div>
      <div style={{ gridColumn: '3' }}>{renderSlot('Ring')}</div>

      <div style={{ gridColumn: '1 / span 3' }}>
        <h3>Total Stats: {calculateTotalStats()}</h3>
      </div>
    </div>
  );
};

const Shop = ({ gold, inventoryFull, onPurchase }) => {
  function getItemUrl (name) {
    return new URL(`./assets/items/${name}.png`, import.meta.url).href
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
    }}>
      <h2 style={{ marginTop: 0 }}>Shop</h2>
      <label htmlFor='buy-crystal' className="shop-label" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: '20px',
        backgroundColor: '#d5d5d5',
        padding: '10px',
      }}>
        <div>
          {<img src={getItemUrl('crystal')} alt="Crystal" />}
          <p style={{margin: '0'}}>Crystal (1 Gold)</p>
        </div>
        <button id='buy-crystal' onClick={() => onPurchase('Crystal')} 
          disabled={(gold < 1) || inventoryFull}
        >
          Buy
        </button>
      </label>
      <label htmlFor='buy-potion' className="shop-label" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: '20px',
        backgroundColor: '#d5d5d5',
        padding: '10px',
      }}>
        <div>
          {<img src={getItemUrl('potion')} alt="Potion" />}
          <p style={{margin: '0'}}>Potion (1 Gold)</p>
        </div>
        <button id='buy-potion' onClick={() => onPurchase('Potion')} disabled={gold < 1}>
          Buy
        </button>
      </label>
    </div>
  );
}; 

const Recycler = ({ inventory, inventoryFull, scrap, onRecycle, onExchange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [exchangeRarity, setExchangeRarity] = useState('Common');
  const [exchangeItem, setExchangeItem] = useState('');
  const validEquipmentTypes = ['Hat', 'Cape', 'Amulet', 'Weapon', 'Body', 'Pants', 
    'Gloves', 'Boots', 'Ring' ];
  
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Magic': return '#3B88FF';
      case 'Rare': return '#F44336';
      case 'Unique': return '#000';
      default: return '#ccc';
    }
  };

  function getItemUrl (name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`./assets/items/${name}.png`, import.meta.url).href
    }
    return new URL(`./assets/items/${name}-${rarity}.png`, import.meta.url).href
  }

  const handleRecycle = () => {
    onRecycle(selectedItems);
    setSelectedItems([]);
  };

  const handleRecycleAll = () => {
    const recycledScrap = Object.entries(inventory)
      .filter(([category]) => category !== 'Gold' && category !== 'Potion' && category !== 'Crystal')
      .flatMap(([, items]) => Array.isArray(items) ? items.filter(item => item.rarity) : []);
    onRecycle(recycledScrap);
  };

  const handleExchange = () => {
    if (scrap[exchangeRarity] >= 2 && exchangeItem && validEquipmentTypes.includes(exchangeItem)) {
      onExchange(exchangeRarity, exchangeItem);
      setExchangeItem('');
    }
  };

  const recyclableItems = Object.entries(inventory)
    .filter(([category]) => category !== 'Gold' && category !== 'Potion' && category !== 'Crystal')
    .flatMap(([, items]) => 
    Array.isArray(items) ? items.filter(item => item.rarity) : []
  );

  return (
    <div style={{ padding: 0, backgroundColor: '#f0f0f0' }}>
      <h2 style={{ paddingTop: '20px' }}>Recycler</h2>
      <div style={{ backgroundColor: '#d5d5d5', padding: '10px 0' }}>
        <h3 style={{ margin: '0' }}>Select items to recycle:</h3>
        <div style={{ display: 'flex' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 50px)',
            gridGap: '4px', 
            margin: '0 auto',
            alignItems: 'center',
          }}>
            {recyclableItems.map((item, index) => (
              <label key={index} htmlFor={'recycling' + index} style={{ 
                border: `2px solid ${getRarityColor(item.rarity)}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <input
                  id={'recycling' + index}
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  style={{}}
                  onChange={() => {
                    if (selectedItems.includes(item)) {
                      setSelectedItems(selectedItems.filter(i => i !== item));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  }}
                />
                <img
                  src={getItemUrl(item.name.toLowerCase(), item.rarity.toLowerCase())}
                  alt={item.rarity + ' ' + item.name}
                  style={{}}
                />
              </label>
            ))}
          </div>
        </div>
        <div style={{marginTop:'5px'}}>
          <button 
            onClick={handleRecycle} 
            style={{margin: '0 10px'}}
            disabled={selectedItems.length === 0}
          >
            Recycle
          </button>
          <button 
            onClick={handleRecycleAll} 
            style={{margin: '0 10px'}} 
            disabled={recyclableItems.length === 0}
          >
            Recycle All
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#d5d5d5', padding: '10px 0' }}>
        {Object.entries(scrap).map(([rarity, count]) => (
          <span key={rarity} style={{ 
            padding: '0 0.3em', 
            margin: '0 5px',
            borderRadius: '4px',
            fontSize: '2em',
            fontWeight: '1000',
            color: `${getRarityColor(rarity)}`,
            backgroundColor: '#f0f0f0',
          }}>
            {count}
          </span>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Exchange Scrap:</h3>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: 0
          }}
        >
          <select 
            value={exchangeRarity}
            onChange={(e) => setExchangeRarity(e.target.value)}
            style={{ 
              padding: '5px',
              borderRadius: '3px',
              backgroundColor: getRarityColor(exchangeRarity),
              color: 'white',
            }}
          >
            {Object.keys(scrap).map(rarity => (
              <option key={rarity} value={rarity} 
                style={{ backgroundColor: getRarityColor(rarity) }}
              >
                {rarity}
              </option>
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
          
        </div>
        <button 
          onClick={handleExchange} 
          disabled={scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull}
          style={{ 
            padding: '5px 10px', 
            marginTop: '10px',
            backgroundColor: scrap[exchangeRarity] < 2 || !exchangeItem || 
              inventoryFull ? '#aaa' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: scrap[exchangeRarity] < 2 || !exchangeItem || 
              inventoryFull ? 'not-allowed' : 'pointer',
          }}
        >
          Exchange
        </button>
        <p style={{paddingBottom:'20px'}}>
          {inventoryFull && <span style={{color: 'red'}}>Inventory is full!</span>}
          <br/>
          Cost: 2 {exchangeRarity} scrap
        </p>
      </div>
    </div>
  );
};

const CoinFlipMMORPG = () => {
  const {
    inventory,
    equipment,
    scrap,
    inventoryFull,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    updateCurrency,
    recycleItems,
    removeScrap
  } = useInventoryManager();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1/2, color: '#4CAF50' },
    medium: { label: 'Medium', rate: 1/10, color: '#3B88FF' },
    hard: { label: 'Hard', rate: 1/100, color: '#F44336' },
    impossible: { label: 'Impossible', rate: 1/1000, color: '#000' }
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
  const [view, setView] = useState('game');
  const [crystalTimer, setCrystalTimer] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [potionTimer, setPotionTimer] = useState(0);
  const inventorySlots = 16;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#4CAF50';
      case 'Magic': return '#3B88FF';
      case 'Rare': return '#F44336';
      case 'Unique': return '#000';
      default: return '#ccc';
    }
  };
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
    return Object.values(equipment).reduce((total, item) => {
      return total + (item && item.stat ? item.stat : 0);
    }, 0);
  };

  const purchaseItem = (item) => {
    if (item === 'Crystal' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Crystal', { name: 'Crystal', rarity: 'Crystal' });
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Potion' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      updateCurrency('Potion', 1);
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    }
  };

  const useCrystal = (item) => {
    console.log('useCrystal');
    removeItem('Crystal', item);
    setCrystalTimer(300);
  };

  const usePotion = () => {
    if (inventory.Potion > 0) {
      updateCurrency('Potion', -1);
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
    recycleItems(items);
  };

  const handleExchange = (rarity, itemName) => {
    removeScrap(rarity);
    addItem(itemName, { name: itemName, rarity, stat: getRarityStat(rarity) });
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
        updateCurrency(randomItem, extraItems);
        newItem = { name: randomItem, count: extraItems };
      } else {
        const stat = getRarityStat(rarity);
        newItem = { name: randomItem, rarity, stat };
        if (!inventoryFull) {
          addItem(randomItem, newItem);
        } else {
          newItem.missed = true;
        }
      }
      setRecentItems(prev => [newItem, ...prev.slice(0, 4)]);
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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        checkForItem();
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

  const renderGame = () => (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>CoinFlip Legends: The Flippening</h1>
      
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            {Object.entries(difficultyLevels).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                style={{
                  backgroundColor: difficulty === key ? color : 'transparent',
                  color: difficulty === key ? 'white' : 'black',
                  padding: '0.5em',
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
            style={{ width: '100%', height: '4em', marginBottom: '16px' }}
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>

          <div style={{
            marginBottom: '10px',
            textAlign: 'center',
            fontStyle: 'italic' }}
          >
            Base win rate: {(difficultyLevels[difficulty].rate * 100).toFixed(2)}%
            <br />
            Effective win rate: {(calculateWinRate() * 100).toFixed(2)}%
            <br />
            Item drop rate: {calculateItemDropRate()}%
          </div>

          {(crystalTimer > 0 || potionTimer > 0) && (
            <div style={{ 
              marginBottom: '10px', 
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#80d3da',
              borderRadius: '5px',
            }}>
              {crystalTimer > 0 && (
                <div>
                  Crystal Boost: {Math.floor(crystalTimer / 60)}:{(crystalTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
              {potionTimer > 0 && (
                <div>
                  Potion Effect: {Math.floor(potionTimer / 60)}:{(potionTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          )}
      
          <div style={{ marginBottom: '30px' }}>
            <h3>Recently Obtained Items:</h3>
            {recentItems.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {recentItems.map((item, index) => (
                  <li key={index} style={{ 
                    color: `${getRarityColor(item.rarity)}`,
                    textShadow: '1px 1px #000',
                    borderRadius: '4px',
                    textDecoration: item.missed ? 'line-through' : 'none',
                  }}>
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
          
          <ProgressBar
            difficulty={difficulty} 
            scores={scores} 
            difficultyLevels={difficultyLevels} 
          />
          
          {message && (
            <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#FFF3CD', border: '1px solid #FFEEBA' }}>
              <p>{message}</p>
            </div>
          )}
          
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
            <p>Notice: Any resemblance to actual games is purely coincidental.</p>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
            Version 1.1.1
          </div>
    </div>
  );

  const renderInventory = () => (
    <div style={{ 
      backgroundColor: '#f0f0f0',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <h3>Inventory</h3>
      <InventoryGrid 
        items={inventory}
        onEquip={equipItem}
        onUsePotion={usePotion}
        onUseCrystal={useCrystal}
      />
    </div>
  );

  const renderEquipment = () => (
    <div style={{ 
      backgroundColor: '#f0f0f0',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <h3>Equipment</h3>
      <WornEquipment 
        equipment={equipment}
        onUnequip={unequipItem}
      />
    </div>
  );

  const renderCharacter = () => (
    <div style={{
      maxWidth: '420px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{ width: '55%' }}>
        <h3>Inventory</h3>
        <InventoryGrid 
          items={inventory}
          onEquip={equipItem}
          onUsePotion={usePotion}
        />
      </div>
      <div style={{ width: '45%', backgroundColor: '#ccc', }}>
        <h3>Equipment</h3>
        <WornEquipment 
          equipment={equipment}
          onUnequip={unequipItem}
        />
      </div>
    </div>
  );

  const renderShop = () => (
    <>
      <Shop 
        gold={inventory.Gold} 
        inventoryFull={inventoryFull}
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
  );

  const renderRecycler = () => (
    <Recycler
      inventory={inventory}
      inventoryFull={inventoryFull}
      scrap={scrap}
      onRecycle={handleRecycle}
      onExchange={handleExchange}
    />
  );

  return (
    <div style={{ 
      width: isDesktop ? '100%' : '420px', 
      margin: '0 auto',
      display: isDesktop ? 'flex' : 'block',
      justifyContent: 'center',
      gap: '20px',
    }}>
      {!isDesktop && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => setView('game')} style={{ marginRight: '10px' }}>Game</button>
          <button onClick={() => setView('character')} style={{ marginRight: '10px' }}>Character</button>
          <button onClick={() => setView('recycler')} style={{ marginRight: '10px' }}>Recycler</button>
          <button onClick={() => setView('shop')}>Shop</button>
        </div>
      )}

      {isDesktop ? (
        <>
          <div style={{ width: '30%' }}>
            {renderInventory()}
            {renderShop()}
          </div>
          <div style={{ width: '40%' }}>{renderGame()}</div>
          <div style={{ width: '30%' }}>
            {renderEquipment()}
            {renderRecycler()}
          </div>
        </>
      ) : (
        <>
          {view === 'game' && renderGame()}
          {view === 'character' && renderCharacter()}
          {view === 'shop' && renderShop()}
          {view === 'recycler' && renderRecycler()}
        </>
      )}

      <Confetti active={showConfetti} difficulty={difficulty} />
    </div>
  );
};

export default CoinFlipMMORPG;
