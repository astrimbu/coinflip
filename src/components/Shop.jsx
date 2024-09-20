/* eslint-disable react/prop-types */
import { useState } from 'react';
import { getItemUrl } from '../utils';

const Shop = ({ gold, inventoryFull, onPurchase }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const renderShopItem = (itemName, price, description) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '5px',
        backgroundColor: '#d5d5d5',
        padding: '10px',
        position: 'relative',
        gap: '5px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHoveredItem(itemName)}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => {
        if (gold >= price && !(itemName === 'Crystal' && inventoryFull)) {
          onPurchase(itemName);
        }
      }}
    >
      <img src={getItemUrl(itemName.toLowerCase())} alt={itemName} style={{ width: '30px', height: '30px' }} />
      <span>{`${itemName} (${price}G)`}</span>
      {hoveredItem === itemName && (
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '3px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            fontSize: '0.8em',
          }}
        >
          {description}
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {renderShopItem('Crystal', 1, 'Improves drop rate')}
      {renderShopItem('Potion', 1, 'Improves damage')}
      {renderShopItem('Logs', 1, 'Fire attracts monsters')}
      {renderShopItem('Tuna', 1, 'Heals 10 HP')}
    </div>
  );
};

export default Shop;
