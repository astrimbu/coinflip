/* eslint-disable react/prop-types */
import { useState } from 'react';

const Recycler = ({
  inventory,
  inventoryFull,
  scrap,
  onRecycle,
  onExchange,
  recycleMode,
  toggleRecycleMode,
}) => {
  const [exchangeRarity, setExchangeRarity] = useState('Common');
  const [exchangeItem, setExchangeItem] = useState('');

  const validEquipmentTypes = [
    'Hat',
    'Cape',
    'Amulet',
    'Weapon',
    'Body',
    'Pants',
    'Gloves',
    'Boots',
    'Ring',
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common':
        return '#4CAF50';
      case 'Magic':
        return '#3B88FF';
      case 'Rare':
        return '#F44336';
      case 'Unique':
        return '#000';
      default:
        return '#ccc';
    }
  };

  function getItemUrl(name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`../assets/items/${name}.png`, import.meta.url).href;
    }
    return new URL(`../assets/items/${name}-${rarity}.png`, import.meta.url)
      .href;
  }

  const handleRecycle = () => {
    onRecycle(selectedItems);
    setSelectedItems([]);
  };

  const handleRecycleAll = () => {
    const recycledScrap = Object.entries(inventory)
      .filter(
        ([category]) =>
          category !== 'Gold' && category !== 'Potion' && category !== 'Crystal'
      )
      .flatMap(([, items]) =>
        Array.isArray(items) ? items.filter((item) => item.rarity) : []
      );
    onRecycle(recycledScrap);
  };

  const handleExchange = () => {
    if (
      scrap[exchangeRarity] >= 2 &&
      exchangeItem &&
      validEquipmentTypes.includes(exchangeItem)
    ) {
      onExchange(exchangeRarity, exchangeItem);
      setExchangeItem('');
    }
  };

  const recyclableItems = Object.entries(inventory)
    .filter(
      ([category]) =>
        category !== 'Gold' && category !== 'Potion' && category !== 'Crystal'
    )
    .flatMap(([, items]) =>
      Array.isArray(items) ? items.filter((item) => item.rarity) : []
    );

  return (
    <div style={{ padding: '10px', backgroundColor: '#f0f0f0', fontSize: '0.9em' }}>
      <div style={{ backgroundColor: '#d5d5d5', padding: '5px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={toggleRecycleMode}
          style={{
            padding: '5px 10px',
            backgroundColor: recycleMode ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={new URL('../assets/items/hammer.png', import.meta.url).href}
            alt="Recycle"
            style={{ width: '20px', height: '20px' }}
          />
          {recycleMode ? 'Cancel' : ''}
        </button>
        <button
          onClick={handleRecycleAll}
          disabled={recyclableItems.length === 0}
          style={{ padding: '5px 10px', fontSize: '0.9em', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: recyclableItems.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          Recycle All
        </button>
      </div>
      <div style={{ backgroundColor: '#d5d5d5', padding: '5px', marginBottom: '10px' }}>
        {Object.entries(scrap).map(([rarity, count]) => (
          <span key={rarity} style={{ padding: '0 0.2em', margin: '0 2px', borderRadius: '2px', fontSize: '1.2em', fontWeight: 'bold', color: getRarityColor(rarity), backgroundColor: '#f0f0f0' }}>
            {count}
          </span>
        ))}
      </div>
      <div>
        <h3 style={{ margin: '0 0 5px', fontSize: '1em' }}>Exchange Scrap:</h3>
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '5px' }}>
          <select value={exchangeRarity} onChange={(e) => setExchangeRarity(e.target.value)} style={{ padding: '2px', borderRadius: '2px', backgroundColor: getRarityColor(exchangeRarity), color: 'white', fontSize: '0.8em' }}>
            {Object.keys(scrap).map(rarity => (
              <option key={rarity} value={rarity} style={{ backgroundColor: getRarityColor(rarity) }}>{rarity}</option>
            ))}
          </select>
          <select value={exchangeItem} onChange={(e) => setExchangeItem(e.target.value)} style={{ padding: '2px', borderRadius: '2px', fontSize: '0.8em' }}>
            <option value=''>Select item type</option>
            {validEquipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExchange}
          disabled={scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull}
          style={{
            padding: '2px 5px',
            backgroundColor: scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull ? '#aaa' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull ? 'not-allowed' : 'pointer',
            fontSize: '0.8em'
          }}
        >
          Exchange
        </button>
        <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>Cost: 2 {exchangeRarity} scrap</p>
      </div>
    </div>
  );
};

export default Recycler;
