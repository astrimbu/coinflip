/* eslint-disable react/prop-types */
import { useState } from 'react';

const Shop = ({ gold, inventoryFull, onPurchase }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const getItemUrl = (name) => new URL(`../assets/items/${name}.png`, import.meta.url).href;

  const renderShopItem = (itemName, price, description) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '10px',
        backgroundColor: '#d5d5d5',
        padding: '20px',
        position: 'relative',
        gap: '10px',
      }}
      onMouseEnter={() => setHoveredItem(itemName)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <img src={getItemUrl(itemName.toLowerCase())} alt={itemName} style={{ width: '24px', height: '24px' }} />
      <span>{`${itemName} (${price}G)`}</span>
      <button
        onClick={() => onPurchase(itemName)}
        disabled={gold < price || (itemName === 'Crystal' && inventoryFull)}
        style={{ padding: '10px' }}
      >
        Buy
      </button>
      {hoveredItem === itemName && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
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
      {renderShopItem('Crystal', 1, '2x drop rate, 5:00')}
      {renderShopItem('Potion', 1, '2x damage, 2:00')}
      {renderShopItem('Logs', 1, 'Used to light a fire')}
    </div>
  );
};

export default Shop;
