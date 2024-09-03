/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getColor } from '../utils.js';
import InventoryGrid from './InventoryGrid';
import WornEquipment from './WornEquipment';

const Recycler = ({
  inventory,
  inventoryFull,
  scrap,
  onRecycle,
  onExchange,
  onEquip,
  onUsePotion,
  onUseCrystal,
  equipment,
  onUnequip,
}) => {
  const [exchangeRarity, setExchangeRarity] = useState('Common');
  const [exchangeItem, setExchangeItem] = useState('');
  const hammer = new URL(`../assets/items/hammer.png`, import.meta.url).href;
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
    <div style={{
      display: 'flex',
      backgroundColor: '#f0f0f0',
      fontSize: '0.9em',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', alignItems: 'center' }}>
        <div>
          <InventoryGrid
            items={inventory}
            onEquip={onEquip}
            onUsePotion={onUsePotion}
            onUseCrystal={onUseCrystal}
            onRecycle={onRecycle}
            recycleMode={true}
          />
          <div style={{
            padding: '5px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
              onClick={handleRecycleAll}
              disabled={recyclableItems.length === 0}
              style={{
                padding: '10px 20px',
                fontSize: '1.2em',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: recyclableItems.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Recycle All
            </button>
          </div>
        </div>
        <div>

          <div style={{ padding: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
            {Object.entries(scrap).map(([rarity, count]) => (
              <div key={rarity} style={{ color: getColor(rarity) }}>
                {rarity}: {count}
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '5px' }}>
              <select value={exchangeRarity} onChange={(e) => setExchangeRarity(e.target.value)} style={{ padding: '2px', borderRadius: '2px', backgroundColor: getColor(exchangeRarity), color: 'white', fontSize: '0.8em' }}>
                {Object.keys(scrap).map(rarity => (
                  <option key={rarity} value={rarity} style={{ backgroundColor: getColor(rarity) }}>{rarity}</option>
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
                padding: '8px 15px',
                backgroundColor: scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull ? '#aaa' : '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: scrap[exchangeRarity] < 2 || !exchangeItem || inventoryFull ? 'not-allowed' : 'pointer',
                fontSize: '1em',
                width: 'auto',
                marginTop: '5px',
              }}
            >
              Exchange
            </button>
            <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>Cost: 2 {exchangeRarity} scrap</p>
          </div>
        </div>
        <div>
          <WornEquipment
            equipment={equipment}
            onUnequip={onUnequip}
            fullUnique={Object.values(equipment).every(item => item && item.rarity === 'Unique')}
          />
        </div>
      </div>

    </div>
  );
};

export default Recycler;
