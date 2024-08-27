/* eslint-disable react/prop-types */
import { useState } from 'react';

const InventoryGrid = ({ items, onEquip, onUsePotion, onUseCrystal }) => {
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
    if (flattenedItems[index].name === 'Crystal') {
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
        width: '200px',
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
          marginBottom: '10px',
        }}
      >
        <div
          data-testid='Gold'
          style={{
            border: '2px solid #aaa',
            padding: '5px',
            textAlign: 'center',
          }}
        >
          <img src={getItemUrl('gold')} alt='Gold' /> {items.Gold}
        </div>
        <div
          style={{
            border: '2px solid #aaa',
            padding: '5px',
            textAlign: 'center',
            cursor: items.Potion > 0 ? 'pointer' : 'default',
            opacity: items.Potion > 0 ? 1 : 0.5,
          }}
          onClick={() => items.Potion > 0 && onUsePotion()}
        >
          <img src={getItemUrl('potion')} alt='Potion' /> {items.Potion}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 50px)',
          gridGap: '9px',
        }}
      >
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              border: '3px solid #ccc',
              position: 'relative',
              outline: flattenedItems[index]
                ? `3px solid ${getRarityColor(flattenedItems[index].rarity)}`
                : 'none',
              outlineOffset: '-3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                  style={{}}
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
        <p style={{ margin: '10px 0 0 0' }}>Inventory is full</p>
      )}
    </div>
  );
};

export default InventoryGrid;
