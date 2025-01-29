import React, { useState, useEffect } from 'react';
import { getColor } from '../utils';
import { monsterTypes } from '../constants/gameData';
import { achievements } from '../constants/achievements';

const Codex = ({ onClose, completedAchievements, pets, killCount }) => {
  const [selectedCategory, setSelectedCategory] = useState('monsters');
  const [selectedMonster, setSelectedMonster] = useState('Goblin');
  const [selectedAchievement, setSelectedAchievement] = useState(null);

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
      { item: 'Pet', rarity: 'Unique', dropRate: '0.1%' }
    ],
    Ogre: [
      { item: 'Weapon', rarity: 'Magic' },
      { item: 'Body', rarity: 'Magic' },
      { item: 'Pet', rarity: 'Unique', dropRate: '0.1%' }
    ],
    Demon: [
      { item: 'Weapon', rarity: 'Rare' },
      { item: 'Body', rarity: 'Rare' },
      { item: 'Pet', rarity: 'Unique', dropRate: '0.1%' }
    ],
    Dragon: [
      { item: 'Weapon', rarity: 'Unique' },
      { item: 'Body', rarity: 'Unique' },
      { item: 'Pet', rarity: 'Unique', dropRate: '0.1%' }
    ]
  };

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
          <div style={{ 
            padding: '10px', 
            display: 'flex', 
            flexDirection: 'row', 
            height: 'auto'
          }}>
            {/* Left sidebar monster list */}
            <div style={{
              width: '120px',
              borderRight: '1px solid #ccc',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '10px',
              overflowY: 'auto'
            }}>
              {Object.keys(monsterDrops).map(monster => (
                <button
                  key={monster}
                  onClick={() => setSelectedMonster(monster)}
                  style={{
                    padding: '2px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: selectedMonster === monster ? '#eee' : 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100%'
                  }}
                >
                  <img 
                    src={`/coinflip/assets/monsters/${monster.toLowerCase()}.png`}
                    alt={monster}
                    style={{ height: '24px' }}
                  />
                  <span style={{ 
                    color: '#333',
                    fontSize: '0.9em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {monster}
                  </span>
                </button>
              ))}
            </div>

            {/* Right side monster details */}
            <div style={{ flex: 1, padding: '10px' }}>
              {selectedMonster && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                  <div style={{ flex: 1, alignSelf: 'flex-start' }}>
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
                    <div style={{ color: '#666', fontSize: '0.9em', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                      Kills: {killCount[selectedMonster] || 0}
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, 40px)', justifyContent: 'center' }}>
                    {monsterDrops[selectedMonster].map((drop, index) => (
                      <div 
                        key={index}
                        style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          borderRadius: '4px',
                          position: 'relative'
                        }}
                      >
                        <img 
                          src={drop.item === 'Pet' 
                            ? `/coinflip/assets/monsters/${selectedMonster.toLowerCase()}.png`
                            : drop.rarity 
                              ? `/coinflip/assets/items/${drop.item.toLowerCase()}-${drop.rarity.toLowerCase()}.png`
                              : `/coinflip/assets/items/${drop.item.toLowerCase()}.png`
                          }
                          alt={drop.item}
                          style={{ height: '32px' }}
                        />
                        {drop.item === 'Pet' && pets[selectedMonster]?.count > 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '-5px',
                            right: '-5px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {pets[selectedMonster].count}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div style={{ 
            padding: '10px',
            display: 'flex',
            gap: '10px'
          }}>
            <div style={{
              width: '200px',
              borderRight: '1px solid #ccc',
              padding: '10px',
              fontSize: '0.9em'
            }}>
              {selectedAchievement ? (
                <>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    <span style={{ marginRight: '8px' }}>{selectedAchievement.icon}</span>
                    {selectedAchievement.title}
                  </h3>
                  <p style={{ color: '#666', margin: '0' }}>{selectedAchievement.description}</p>
                  {completedAchievements?.includes(selectedAchievement.id) && (
                    <div style={{ 
                      marginTop: '10px',
                      color: '#4CAF50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>✓</span> Completed
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: '#666' }}>
                  Select an achievement to view details
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              display: 'grid',
              gap: '10px',
              gridTemplateColumns: 'repeat(3, 1fr)',
              justifyItems: 'center'
            }}>
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  onClick={() => setSelectedAchievement(achievement)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: completedAchievements?.includes(achievement.id) 
                      ? '#e8f5e9'
                      : '#fff',
                    opacity: completedAchievements?.includes(achievement.id) ? 1 : 0.7,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    transform: selectedAchievement?.id === achievement.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div style={{ 
                    fontSize: '32px',
                    position: 'relative'
                  }}>
                    {achievement.icon}
                    {completedAchievements?.includes(achievement.id) && 
                      <span style={{ 
                        color: '#4CAF50',
                        position: 'absolute',
                        bottom: '-10px',
                        right: '-10px',
                        fontSize: '16px'
                      }}>
                        ✓
                      </span>
                    }
                  </div>
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