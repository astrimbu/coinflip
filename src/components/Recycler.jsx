/* eslint-disable react/prop-types */
import { useState } from 'react';

const Recycler = ({
  inventory,
  inventoryFull,
  scrap,
  onRecycle,
  onExchange,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
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
    <div style={{ padding: 0, backgroundColor: '#f0f0f0' }}>
      <h2 style={{ paddingTop: '20px' }}>Recycler</h2>
      <div style={{ backgroundColor: '#d5d5d5', padding: '10px 0' }}>
        <h3 style={{ margin: '0' }}>Select items to recycle:</h3>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 50px)',
              gridGap: '4px',
              margin: '0 auto',
              alignItems: 'center',
            }}
          >
            {recyclableItems.map((item, index) => (
              <label
                key={index}
                htmlFor={'recycling' + index}
                style={{
                  border: `2px solid ${getRarityColor(item.rarity)}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <input
                  id={'recycling' + index}
                  type='checkbox'
                  checked={selectedItems.includes(item)}
                  style={{}}
                  onChange={() => {
                    if (selectedItems.includes(item)) {
                      setSelectedItems(selectedItems.filter((i) => i !== item));
                    } else {
                      setSelectedItems([...selectedItems, item]);
                    }
                  }}
                />
                <img
                  src={getItemUrl(
                    item.name.toLowerCase(),
                    item.rarity.toLowerCase()
                  )}
                  alt={item.rarity + ' ' + item.name}
                  style={{}}
                />
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '5px' }}>
          <button
            onClick={handleRecycle}
            style={{ margin: '0 10px' }}
            disabled={selectedItems.length === 0}
          >
            Recycle
          </button>
          <button
            onClick={handleRecycleAll}
            style={{ margin: '0 10px' }}
            disabled={recyclableItems.length === 0}
          >
            Recycle All
          </button>
        </div>
      </div>
      <div style={{ backgroundColor: '#d5d5d5', padding: '10px 0' }}>
        {Object.entries(scrap).map(([rarity, count]) => (
          <span
            key={rarity}
            style={{
              padding: '0 0.3em',
              margin: '0 5px',
              borderRadius: '4px',
              fontSize: '2em',
              fontWeight: '1000',
              color: `${getRarityColor(rarity)}`,
              backgroundColor: '#f0f0f0',
            }}
          >
            {count}
          </span>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Exchange Scrap:</h3>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: 0,
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
            {Object.keys(scrap).map((rarity) => (
              <option
                key={rarity}
                value={rarity}
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
            <option value=''>Select item type</option>
            {validEquipmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExchange}
          disabled={scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull}
          style={{
            padding: '5px 10px',
            marginTop: '10px',
            backgroundColor:
              scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull
                ? '#aaa'
                : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor:
              scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          Exchange
        </button>
        <p style={{ paddingBottom: '20px' }}>Cost: 2 {exchangeRarity} scrap</p>
      </div>
    </div>
  );
};

export default Recycler;
