/* eslint-disable react/prop-types */
import { useState } from 'react';

const Shop = ({ gold, inventoryFull, onPurchase }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  function getItemUrl(name) {
    return new URL(`../assets/items/${name}.png`, import.meta.url).href;
  }

  const renderShopItem = (itemName, price, description) => (
    <label
      htmlFor={`buy-${itemName.toLowerCase()}`}
      className='shop-label'
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: '20px',
        backgroundColor: '#d5d5d5',
        padding: '10px',
        position: 'relative',
      }}
      onMouseEnter={() => setHoveredItem(itemName)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div>
        <img src={getItemUrl(itemName.toLowerCase())} alt={itemName} />
        <p style={{ margin: '0' }}>{`${itemName} (${price} Gold)`}</p>
      </div>
      <button
        id={`buy-${itemName.toLowerCase()}`}
        onClick={() => onPurchase(itemName)}
        disabled={gold < price || (itemName === 'Crystal' && inventoryFull)}
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
            padding: '5px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
          }}
        >
          {description}
        </div>
      )}
    </label>
  );

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Shop</h2>
      {renderShopItem('Crystal', 1, '2x drop rate, 5:00')}
      {renderShopItem('Potion', 1, '2x damage, 2:00')}
    </div>
  );
};

export default Shop;
