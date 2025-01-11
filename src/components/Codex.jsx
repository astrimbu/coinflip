import React, { useState, useEffect } from 'react';
import { getColor } from '../utils';
import { monsterTypes } from '../constants/gameData';

const Codex = ({ onClose, completedAchievements }) => {
  const [selectedCategory, setSelectedCategory] = useState('monsters');
  const [selectedMonster, setSelectedMonster] = useState(null);

  const categories = {
    monsters: {
      title: 'Monsters',
      icon: '🦖'
    },
    achievements: {
      title: 'Achievements',
      icon: '🏆'
    }
  };

  const monsterDrops = {
    Goblin: [
      { item: 'Weapon', rarity: 'Common' },
      { item: 'Body', rarity: 'Common' },
      { item: 'Gold', rarity: null }
    ],
    Ogre: [
      { item: 'Weapon', rarity: 'Magic' },
      { item: 'Body', rarity: 'Magic' },
      { item: 'Gold', rarity: null }
    ],
    Demon: [
      { item: 'Weapon', rarity: 'Rare' },
      { item: 'Body', rarity: 'Rare' },
      { item: 'Gold', rarity: null }
    ],
    Dragon: [
      { item: 'Weapon', rarity: 'Unique' },
      { item: 'Body', rarity: 'Unique' },
      { item: 'Gold', rarity: null }
    ]
  };

  const achievements = [
    {
      id: 'common_set',
      title: 'Common Ground',
      description: 'Equip a full set of Common gear',
      icon: '👕'
    }
  ];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const renderContent = () => {
    switch (selectedCategory) {
      case 'monsters':
        return (
          <div style={{ padding: '10px', position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {selectedMonster ? (
              <>
                <button 
                  onClick={() => setSelectedMonster(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '5px',
                    cursor: 'pointer',
                    backgroundColor: '#e0e0e0',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#333'
                  }}
                >
                  ← Back
                </button>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#333', margin: '0' }}>
                    <img 
                      src={`/coinflip/assets/monsters/${selectedMonster.toLowerCase()}.png`}
                      alt={selectedMonster}
                      style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }}
                    />
                    {selectedMonster}
                  </h3>
                  <div style={{ color: '#666', fontSize: '0.9em', marginTop: '10px' }}>
                    <div title="Health">❤️: {monsterTypes[selectedMonster].maxHP}</div>
                    <div title="Damage">💥: {monsterTypes[selectedMonster].damage}</div>
                    <div title="Stats">💪: {monsterTypes[selectedMonster].stats}</div>
                  </div>
                </div>
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {monsterDrops[selectedMonster].map((drop, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '5px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          width: '150px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#fff'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={drop.rarity 
                              ? `/coinflip/assets/items/${drop.item.toLowerCase()}-${drop.rarity.toLowerCase()}.png`
                              : `/coinflip/assets/items/${drop.item.toLowerCase()}.png`
                            }
                            alt={drop.item}
                            style={{ height: '24px' }}
                          />
                          <span style={{ color: '#333' }}>{drop.item}</span>
                        </div>
                        <span style={{ color: getColor(drop.rarity) }}>
                          {drop.rarity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                gap: '10px', 
                padding: '10px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {Object.keys(monsterDrops).map(monster => (
                  <button
                    key={monster}
                    onClick={() => setSelectedMonster(monster)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: '#e0e0e0',
                      border: 'none',
                      borderRadius: '4px',
                      flex: '0 1 auto'
                    }}
                  >
                    <img 
                      src={`/coinflip/assets/monsters/${monster.toLowerCase()}.png`}
                      alt={monster}
                      style={{ height: '32px' }}
                    />
                    <span style={{ color: '#333' }}>{monster}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'achievements':
        return (
          <div style={{ padding: '10px' }}>
            <div 
              style={{
                display: 'grid', 
                gap: '10px', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: completedAchievements?.includes(achievement.id) 
                      ? '#e8f5e9'  // Light green background for completed
                      : '#fff',
                    opacity: completedAchievements?.includes(achievement.id) ? 1 : 0.7,
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{achievement.icon}</div>
                  <h4 style={{ margin: '5px 0' }}>
                    {achievement.title}
                    {completedAchievements?.includes(achievement.id) && 
                      <span style={{ color: '#4CAF50', marginLeft: '5px' }}>✓</span>
                    }
                  </h4>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '0.9em', 
                    color: completedAchievements?.includes(achievement.id) ? '#2e7d32' : '#666',
                    textAlign: 'center'
                  }}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '314px',
        zIndex: 1000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        position: 'fixed',
        top: '47%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '570px',
        height: '314px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        <div style={{
          padding: '10px',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center' }}>Codex</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '30px',
              cursor: 'pointer',
              color: '#333',
              padding: '10px',
              position: 'absolute',
              right: '0'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #ccc'
        }}>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setSelectedMonster(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: selectedCategory === key ? '#eee' : 'none',
                border: 'none',
                borderRight: '1px solid #ccc',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '20px', display: 'block', color: '#000' }}>{category.icon}</span>
              <span style={{ fontSize: '0.8em', color: '#000' }}>{category.title}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Codex; 