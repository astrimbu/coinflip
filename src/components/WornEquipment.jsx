/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getColor, getBackgroundColor, getItemUrl } from '../utils';

const WornEquipment = ({ equipment, onUnequip, onUpgrade, upgradeMode }) => {
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
            width: '40px',
            height: '40px',
            position: 'relative',
            margin: '0 auto',
            outline: equipment[slot]
              ? `2px solid ${getColor(equipment[slot].rarity)}`
              : '1px solid #888',
            outlineOffset: '-1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: equipment[slot]
              ? getBackgroundColor(equipment[slot].rarity)
              : 'transparent',
            cursor: equipment[slot] ? 'pointer' : 'default',
          }}
          onClick={() => equipment[slot] && (upgradeMode ? onUpgrade(slot) : onUnequip(slot))}
          onMouseEnter={() => setHoveredItem(equipment[slot])}
          onMouseLeave={() => setHoveredItem(null)}
          title={slot.charAt(0).toUpperCase() + slot.slice(1)}
        >
          {equipment[slot] && (
            <img
              src={getItemUrl(equipment[slot].name, equipment[slot].rarity)}
              alt={`${equipment[slot].rarity} ${equipment[slot].name}`}
              style={{ maxWidth: '80%', maxHeight: '80%' }}
              draggable="false"
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
        gap: '2px',
        width: '130px',
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

      <div style={{ gridColumn: '1 / span 3', textAlign: 'center', fontSize: '14px' }}>
        <h3 style={{ margin: '5px 0' }}>Total Stats: {calculateTotalStats()}</h3>
      </div>
    </div>
  );
};

export default WornEquipment;
