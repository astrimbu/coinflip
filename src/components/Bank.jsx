import React from 'react';
import InventoryGrid from './InventoryGrid';
import { getItemUrl, getColor } from '../utils';
import { MIN_HEIGHT_VIEW } from '../constants/gameData';

const Bank = ({ inventory, bankItems, onDeposit, onWithdraw }) => {
  return (
    <div style={{
        display: 'flex',
        height: MIN_HEIGHT_VIEW,
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
        overflow: 'hidden', // Add this to prevent content from overflowing
      }}>
        <div style={{ width: '30%', padding: '10px' }}>
          <h3>Inventory</h3>
          <InventoryGrid
            items={inventory}
            onDeposit={onDeposit}
            actionLabel="Deposit"
          />
        </div>

        <div style={{ width: '70%', padding: '10px', display: 'flex', flexDirection: 'column' }}>
          <h3>Bank</h3>
          <div style={{
            flexGrow: 1,
            overflowY: 'auto',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
              gap: '10px',
              padding: '5px',
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
                        width: '40px',
                        height: '40px',
                        border: `2px solid ${getColor(rarity)}`,
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
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '0px',
                        right: '0px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#f0f0f0',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        lineHeight: '1',
                        padding: '1px',
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
    </div>
  );
};

export default Bank;
