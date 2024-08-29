/* eslint-disable react/prop-types */
import { useState } from 'react';

const InventoryGrid = ({ items, onEquip, onUsePotion, onUseCrystal, onRecycle, recycleMode }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

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
        return '#888';
    }
  };

  function getItemUrl(name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`../assets/items/${name}.png`, import.meta.url).href;
    }
    return new URL(`../assets/items/${name}-${rarity}.png`, import.meta.url)
      .href;
  }

  const handleClick = (flattenedItems, index) => {
    if (!flattenedItems[index]) return;
    if (recycleMode) {
      onRecycle([flattenedItems[index]]);
    } else if (flattenedItems[index].name === 'Crystal') {
      onUseCrystal(flattenedItems[index]);
    } else {
      onEquip(flattenedItems[index], flattenedItems[index].name);
    }
  };

  const flattenedItems = Object.entries(items)
    .filter(([itemName]) => itemName !== 'Gold' && itemName !== 'Potion')
    .flatMap(([, itemArray]) => (Array.isArray(itemArray) ? itemArray : []))
    .slice(0, 16);

  return (
    <div
      data-testid='Inventory'
      style={{
        width: '160px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 0 10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '5px',
        }}
      >
        <div
          data-testid='Gold'
          style={{
            border: '1px solid #aaa',
            padding: '2px',
            textAlign: 'center',
            fontSize: '12px',
          }}
        >
          <img src={getItemUrl('gold')} alt='Gold' style={{ width: '25px', height: '25px' }} /> {items.Gold}
        </div>
        <div
          style={{
            border: '1px solid #aaa',
            padding: '2px',
            textAlign: 'center',
            cursor: items.Potion > 0 ? 'pointer' : 'default',
            opacity: items.Potion > 0 ? 1 : 0.5,
            fontSize: '12px',
          }}
          onClick={() => items.Potion > 0 && onUsePotion()}
        >
          <img src={getItemUrl('potion')} alt='Potion' style={{ width: '25px', height: '25px' }} /> {items.Potion}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 38px)',
          gap: '2px',
          width: '160px',
        }}
      >
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '38px',
              height: '38px',
              border: '1px solid #ccc',
              position: 'relative',
              outline: flattenedItems[index]
                ? `2px solid ${getRarityColor(flattenedItems[index].rarity)}`
                : 'none',
              outlineOffset: '-1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: recycleMode && flattenedItems[index] ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
              cursor: recycleMode && flattenedItems[index] ? 'grab' : 'pointer',
            }}
            onClick={() => handleClick(flattenedItems, index)}
            onMouseEnter={() => setHoveredItem(flattenedItems[index])}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {flattenedItems[index] && (
              <>
                <img
                  src={getItemUrl(
                    flattenedItems[index].name.toLowerCase(),
                    flattenedItems[index].rarity.toLowerCase()
                  )}
                  alt={
                    flattenedItems[index].rarity +
                    ' ' +
                    flattenedItems[index].name
                  }
                  style={{ maxWidth: '80%', maxHeight: '80%' }}
                />
                {hoveredItem === flattenedItems[index] && (
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
                    {`${flattenedItems[index].name} (${flattenedItems[index].rarity})`}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {flattenedItems.length >= 16 && (
        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Inventory is full</p>
      )}
    </div>
  );
};

export default InventoryGrid;
