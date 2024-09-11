/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react';
import { getColor } from '../utils';

const InventoryGrid = ({ items, onEquip, onUsePotion, onUseCrystal, onRecycle, recycleMode, onDeposit, actionLabel, onDrop, scale }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  function getItemUrl(name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`../assets/items/${name}.png`, import.meta.url).href;
    }
    return new URL(`../assets/items/${name}-${rarity}.png`, import.meta.url)
      .href;
  }

  const handleClick = (flattenedItems, index) => {
    if (!flattenedItems[index]) return;
    const item = flattenedItems[index];
    if (onDeposit) {
      onDeposit(item.name, item);  // Bank view
    } else if (recycleMode) {
      onRecycle([item]);
    } else if (item.name === 'Crystal') {
      onUseCrystal(item);
    } else {
      onEquip(item, item.name);
    }
  };

  const flattenedItems = Object.entries(items)
    .filter(([itemName]) => itemName !== 'Gold' && itemName !== 'Potion')
    .flatMap(([, itemArray]) => (Array.isArray(itemArray) ? itemArray : []))
    .slice(0, 16);

  const handleContextMenu = useCallback((e, item) => {
    e.preventDefault();
    if (item) {
      const rect = e.currentTarget.getBoundingClientRect();
      setContextMenu({
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
        item: item
      });
    }
  }, [scale]);

  const handleDropItem = useCallback(() => {
    if (contextMenu) {
      onDrop(contextMenu.item);
      setContextMenu(null);
    }
  }, [contextMenu, onDrop]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div
      data-testid='Inventory'
      style={{
        width: '174px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '172px',
          marginBottom: '2px',
          gap: '4px',
        }}
      >
        <div
          data-testid='Gold'
          style={{
            width: '86px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outlineOffset: '-1px',
            fontSize: '12px',
          }}
        >
          <img src={getItemUrl('gold')} alt='Gold' style={{ width: '25px', height: '25px', marginRight: '5px' }} draggable="false" /> {items.Gold}
        </div>
        <div
          style={{
            width: '86px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outlineOffset: '-1px',
            cursor: items.Potion > 0 ? 'pointer' : 'default',
            opacity: items.Potion > 0 ? 1 : 0.5,
            fontSize: '12px',
          }}
          onClick={() => items.Potion > 0 && onUsePotion()}
        >
          <img src={getItemUrl('potion')} alt='Potion' style={{ width: '25px', height: '25px', marginRight: '5px' }} draggable="false" /> {items.Potion}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2px',
          width: '174px',
          justifyItems: 'center',
        }}
      >
        {[...Array(16)].map((_, index) => (
          <div
            key={index}
            style={{
              width: '40px',
              height: '40px',
              position: 'relative',
              outline: flattenedItems[index]
                ? `2px solid ${getColor(flattenedItems[index].rarity)}`
                : '1px solid #888',
              outlineOffset: '-1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: recycleMode && flattenedItems[index] ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
              cursor: recycleMode && flattenedItems[index] ? 'grab' : 'pointer',
            }}
            onClick={() => handleClick(flattenedItems, index)}
            onContextMenu={(e) => handleContextMenu(e, flattenedItems[index])}
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
                  draggable="false"
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
                    {actionLabel && ` - ${actionLabel}`}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '4px',
            padding: '5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          <button
            onClick={handleDropItem}
            style={{
              background: 'none',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              color: '#333',
              fontSize: '14px',
            }}
          >
            Drop {contextMenu.item.name}
          </button>
        </div>
      )}
      {flattenedItems.length >= 16 && (
        <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>Inventory is full</p>
      )}
    </div>
  );
};

export default InventoryGrid;
