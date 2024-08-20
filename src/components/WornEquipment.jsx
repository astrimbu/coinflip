/* eslint-disable react/prop-types */
import { useState } from 'react';

const WornEquipment = ({ equipment, onUnequip }) => {
  const slots = [
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
    name = name.toLowerCase();
    rarity = rarity.toLowerCase();
    return new URL(`../assets/items/${name}-${rarity}.png`, import.meta.url)
      .href;
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
            outline: equipment[slot]
              ? `3px solid 
                ${getRarityColor(equipment[slot].rarity)}`
              : '2px solid #888',
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
            <div
              style={{
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
              }}
            >
              {`+${equipment[slot].stat} to Stats`}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
      }}
    >
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

export default WornEquipment;
