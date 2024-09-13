import React from 'react';
import InventoryGrid from './InventoryGrid';
import { getItemUrl } from '../utils';
import { MIN_HEIGHT_VIEW } from '../constants/gameData';

const Bank = ({ inventory, bankItems, onDeposit, onWithdraw }) => {
  return (
    <div style={{
        display: 'flex',
        minHeight: MIN_HEIGHT_VIEW,
        minWidth: '600px',
        position: 'relative',
      }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }} />
      <div style={{
        display: 'flex',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ width: '30%', padding: '10px' }}>
          <h3>Inventory</h3>
          <InventoryGrid
            items={inventory}
            onDeposit={onDeposit}
            actionLabel="Deposit"
          />
        </div>

        <div style={{ width: '70%', padding: '10px' }}>
          <h3>Bank</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: '10px',
            maxHeight: '500px',
            overflowY: 'auto'
          }}>
            {Object.entries(bankItems).map(([itemKey, items]) => {
              // Only render if there are items in the stack
              if (items.length > 0) {
                const [name, rarity] = itemKey.split('_');
                const count = items.length;

                return (
                  <div
                    key={itemKey}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => onWithdraw(itemKey)}
                  >
                    <img
                      src={getItemUrl(name, rarity)}
                      alt={name}
                      style={{ width: '40px', height: '40px' }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: rarity === 'common' ? 'black' : rarity === 'rare' ? 'blue' : 'purple'
                    }}>
                      {count}
                    </span>
                  </div>
                );
              }
              return null; // Don't render anything if the stack is empty
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bank;
