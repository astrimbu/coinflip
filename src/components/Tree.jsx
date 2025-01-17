import React from 'react';
import { TREE_LIMITS } from '../constants/gameData';

const TreeNode = ({ title, description, color, onClick, disabled, isRoot, unlocked, isMaxed, nodeType, playerStats, isFloating }) => (
  <div
    onClick={(disabled || !unlocked || isMaxed) ? undefined : onClick}
    style={{
      width: isFloating ? '60px' : '120px',
      height: isFloating ? '25px' : '50px',
      backgroundColor: isMaxed ? '#424242' : disabled ? '#ccc' : unlocked ? color : '#666',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: (disabled || !unlocked || isMaxed) ? 'default' : 'pointer',
      fontSize: isFloating ? '0.7em' : '0.9em',
      padding: '5px',
      border: isMaxed ? '2px solid #ffd700' : isRoot ? '2px solid #333' : 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      boxShadow: isMaxed ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none',
    }}
    onMouseEnter={e => {
      if (!disabled && unlocked && !isMaxed) {
        e.currentTarget.style.transform = 'scale(1.05)';
      }
    }}
    onMouseLeave={e => {
      if (!disabled && unlocked && !isMaxed) {
        e.currentTarget.style.transform = 'scale(1)';
      }
    }}
  >
    <div style={{ 
      fontWeight: 'bold', 
      fontSize: isFloating ? '0.9em' : '0.9em',
      color: isMaxed ? '#ffd700' : 'inherit'
    }}>{title}</div>
    {!isFloating && (
      <div style={{ 
        fontSize: '0.7em',
        color: isMaxed ? '#fff' : 'inherit'
      }}>
        {nodeType === 'auto' ? (playerStats.autoUnlocked ? 'Unlocked' : 'Select to unlock') : description}
      </div>
    )}
    {nodeType && (
      <div style={{
        position: 'absolute',
        bottom: isFloating ? '-15px' : '-20px',
        backgroundColor: isMaxed ? '#ffd700' : '#333',
        color: isMaxed ? '#000' : 'white',
        padding: '2px 6px',
        borderRadius: '10px',
        fontSize: '0.7em',
        fontWeight: 'bold',
      }}>
        Lv.{playerStats.treeInvestments[nodeType]}
      </div>
    )}
  </div>
);

const Tree = ({ onClose, onSelectNode, playerStats }) => {
  // Helper function to check if a node is maxed
  const isNodeMaxed = (nodeType) => {
    return playerStats.treeInvestments[nodeType] >= TREE_LIMITS[nodeType];
  };

  // Helper function to determine if a node should be visible
  const isNodeVisible = (nodeType) => {
    switch (nodeType) {
      case 'auto':
        return true; // Root node is always visible
      case 'damage':
      case 'experience':
      case 'stats':
        return playerStats.autoUnlocked; // Second tier nodes visible after auto
      case 'lifesteal':
        return playerStats.treeInvestments.damage > 0;
      case 'goldBonus':
        return playerStats.treeInvestments.experience > 0;
      default:
        return false;
    }
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '30px 40px',
        borderRadius: '10px',
        textAlign: 'center',
        minWidth: '500px',
        maxHeight: '254px',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <h2 style={{ color: '#333', margin: '0' }}>Tree</h2>
        <div style={{ 
          color: '#666', 
          fontSize: '0.9em', 
          marginBottom: '20px' 
        }}>
          Available Points: {playerStats.treePoints}
        </div>

        {/* Close button in top right */}
        <span 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#666',
            fontSize: '1.2em',
            cursor: 'pointer',
          }}
        >
          ✖
        </span>

        <div style={{ 
          position: 'relative',
          height: '260px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          {/* Connecting lines - only show when nodes are visible */}
          <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {/* Root to second tier connections */}
            {isNodeVisible('damage') && (
              <path d="M250,50 L175,100" stroke="#666" strokeWidth="2" />
            )}
            {isNodeVisible('experience') && (
              <path d="M230,50 L310,100" stroke="#666" strokeWidth="2" />
            )}
            {/* Second tier to third tier connections */}
            {isNodeVisible('moreDamage') && (
              <path d="M175,100 L175,200" stroke="#666" strokeWidth="2" />
            )}
            {isNodeVisible('goldBonus') && (
              <path d="M310,100 L310,200" stroke="#666" strokeWidth="2" />
            )}
          </svg>

          {/* Root node - always visible */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2
          }}>
            <TreeNode
              title="Auto"
              description="Unlock AUTO"
              color="#6d4c41"
              isRoot={true}
              unlocked={true}
              disabled={playerStats.treePoints <= 0}
              onClick={() => onSelectNode('auto')}
              nodeType="auto"
              playerStats={playerStats}
              isMaxed={isNodeMaxed('auto')}
            />
          </div>

          {/* Second level nodes - only show when auto is unlocked */}
          {isNodeVisible('damage') && (
            <div style={{ 
              position: 'absolute', 
              top: '100px',
              left: '50%', 
              transform: 'translateX(-165px)', 
              zIndex: 2 
            }}>
              <TreeNode
                title="Combat"
                description={`Damage +${playerStats.treeInvestments.damage} (${playerStats.treeInvestments.damage}/${TREE_LIMITS.damage})`}
                color="#c62828"
                onClick={() => onSelectNode('damage')}
                nodeType="damage"
                playerStats={playerStats}
                unlocked={playerStats.autoUnlocked}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('damage')}
              />
            </div>
          )}
          {isNodeVisible('experience') && (
            <div style={{ 
              position: 'absolute', 
              top: '100px',
              left: '50%', 
              transform: 'translateX(35px)', 
              zIndex: 2 
            }}>
              <TreeNode
                title="Experience"
                description={`XP +${playerStats.treeInvestments.experience * 10}% (${playerStats.treeInvestments.experience}/${TREE_LIMITS.experience})`}
                color="#2e7d32"
                onClick={() => onSelectNode('experience')}
                nodeType="experience"
                playerStats={playerStats}
                unlocked={playerStats.autoUnlocked}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('experience')}
              />
            </div>
          )}

          {/* Third level nodes - only show when their respective parent is invested */}
          {isNodeVisible('moreDamage') && (
            <div style={{ 
              position: 'absolute', 
              top: '200px',
              left: '50%', 
              transform: 'translateX(-165px)', 
              zIndex: 2 
            }}>
              <TreeNode
                title="More Damage"
                description={`Damage +${playerStats.treeInvestments.moreDamage * 2} (${playerStats.treeInvestments.moreDamage}/${TREE_LIMITS.moreDamage})`}
                color="#d32f2f"
                onClick={() => onSelectNode('moreDamage')}
                nodeType="moreDamage"
                playerStats={playerStats}
                unlocked={playerStats.treeInvestments.damage > 0}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('moreDamage')}
              />
            </div>
          )}
          {isNodeVisible('goldBonus') && (
            <div style={{ 
              position: 'absolute', 
              top: '200px',
              left: '50%', 
              transform: 'translateX(35px)', 
              zIndex: 2 
            }}>
              <TreeNode
                title="Gold Bonus"
                description={`Gold ${playerStats.treeInvestments.goldBonus > 0 ? `x${Math.pow(2, playerStats.treeInvestments.goldBonus)}` : 'x2'} (${playerStats.treeInvestments.goldBonus}/${TREE_LIMITS.goldBonus})`}
                color="#ffd700"
                onClick={() => onSelectNode('goldBonus')}
                nodeType="goldBonus"
                playerStats={playerStats}
                unlocked={playerStats.treeInvestments.experience > 0}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('goldBonus')}
              />
            </div>
          )}

          {/* Floating Stats node */}
          {isNodeVisible('stats') && (
            <div style={{ 
              position: 'absolute', 
              top: '20px',
              right: '20px',
              zIndex: 2 
            }}>
              <TreeNode
                title="Stats"
                description={`Stats +1 (${playerStats.treeInvestments.stats}/${TREE_LIMITS.stats})`}
                color="#9c27b0"
                onClick={() => onSelectNode('stats')}
                nodeType="stats"
                playerStats={playerStats}
                unlocked={playerStats.autoUnlocked}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('stats')}
                isFloating={true}
              />
            </div>
          )}

          {isNodeVisible('lifesteal') && (
            <div style={{ 
              position: 'absolute', 
              top: '200px',
              left: '50%', 
              transform: 'translateX(-165px)', 
              zIndex: 2 
            }}>
              <TreeNode
                title="Lifesteal"
                description={`Heal ${playerStats.treeInvestments.lifesteal * 50}% of damage (${playerStats.treeInvestments.lifesteal}/${TREE_LIMITS.lifesteal})`}
                color="#ff4081"
                onClick={() => onSelectNode('lifesteal')}
                nodeType="lifesteal"
                playerStats={playerStats}
                unlocked={playerStats.treeInvestments.damage > 0}
                disabled={playerStats.treePoints <= 0}
                isMaxed={isNodeMaxed('lifesteal')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tree; 