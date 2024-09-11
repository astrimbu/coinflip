/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getColor, getNextRarity } from '../utils.js';
import InventoryGrid from './InventoryGrid';
import WornEquipment from './WornEquipment';

const Recycler = ({
  inventory,
  inventoryFull,
  scrap,
  onRecycle,
  onUsePotion,
  onUseCrystal,
  equipment,
  onEquip,
  onUnequip,
  onUpgradeSlot,
}) => {
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [exchangeRarity, setExchangeRarity] = useState('Common');
  const [exchangeItem, setExchangeItem] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

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

  const handleUpgradeSlot = (slot) => {
    if (equipment[slot]) {
      const currentRarity = equipment[slot].rarity;
      const nextRarity = getNextRarity(currentRarity);
      if (nextRarity && scrap[currentRarity] >= 2) {
        onUpgradeSlot(slot, nextRarity);
      }
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
            <button
              onClick={() => setUpgradeMode(!upgradeMode)}
              style={{
                padding: '8px 15px',
                backgroundColor: upgradeMode ? '#4CAF50' : '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '1em',
                width: 'auto',
                marginTop: '5px',
              }}
            >
              {upgradeMode ? 'Cancel' : 'Upgrade Mode'}
            </button>
            <p style={{ margin: '5px 0 0', fontSize: '0.8em' }}>
              {upgradeMode ? 'Click an item to upgrade' : 'Click an item to unequip'}
            </p>
          </div>
        </div>
        <div>
          <WornEquipment
            equipment={equipment}
            onUnequip={onUnequip}
            onUpgrade={handleUpgradeSlot}
            upgradeMode={upgradeMode}
          />
        </div>
      </div>

    </div>
  );
};

export default Recycler;
