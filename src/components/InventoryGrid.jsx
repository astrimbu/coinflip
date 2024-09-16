/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react';
import { getColor, getBackgroundColor, getItemUrl, validEquipmentTypes } from '../utils';

const InventoryGrid = ({ items, onEquip, onUsePotion, onUseCrystal, onRecycle, recycleMode, onDeposit, actionLabel, onDrop, scale, onLightFire }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const handleClick = (flattenedItems, index) => {
    if (!flattenedItems[index]) return;
    const item = flattenedItems[index];
    if (onDeposit) {
      onDeposit(item.name, item);  // Bank view
    } else if (recycleMode) {
      if (validEquipmentTypes.includes(item.name)) {
        onRecycle([item]);
      } else { return; }
    } else if (item.name === 'Crystal') {
      onUseCrystal(item);
    } else if (item.name === 'Logs') {
      onLightFire(item);
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
      console.log(e.clientX, e.clientY, rect.left, rect.top);
      setContextMenu({
        x: (e.clientX - (30 * scale)) / scale,
        y: (e.clientY - rect.top + (60 * scale)) / scale,
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
            backgroundBlendMode: 'multiply',
            color: 'white',
            fontWeight: 'bold',
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
            color: 'white',
            fontWeight: 'bold',
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
              backgroundColor: recycleMode && flattenedItems[index]
                ? 'rgba(255, 0, 0, 0.5)'
                : flattenedItems[index]
                  ? getBackgroundColor(flattenedItems[index].rarity)
                  : 'transparent',
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
                  alt={`${flattenedItems[index].rarity} ${flattenedItems[index].name}`}
                  style={{ maxWidth: '80%', maxHeight: '80%' }}
                  draggable="false"
                />
                {hoveredItem === flattenedItems[index] && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      lineHeight: '1',
                      color: '#f0f0f0',
                      textShadow: '1px 1px 1px rgba(0,0,0,1)',
                      fontSize: '10px',
                      fontFamily: 'Arial, sans-serif',
                      padding: '0',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                    }}
                  >
                    <div>
                      <div>{flattenedItems[index].rarity.toUpperCase()}</div>
                      <div>{flattenedItems[index].name.toUpperCase()}</div>
                    </div>
                    {actionLabel && ` - ${actionLabel.toUpperCase()}`}
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
            backgroundColor: '#f0f0f0',
            color: '#111',
            border: '1px solid #aaa',
            borderRadius: '4px',
            padding: '0 5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#aaa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
        >
          <button
            onClick={handleDropItem}
            style={{
              background: 'none',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              color: '#333',
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Drop {contextMenu.item.name.toUpperCase()}
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
