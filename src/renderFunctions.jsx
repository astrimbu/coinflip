import React from 'react';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import InventoryGrid from './components/InventoryGrid';
import Town from './components/Town';
import Shop from './components/Shop';
import WornEquipment from './components/WornEquipment';
import Recycler from './components/Recycler';
import { getItemUrl } from './utils';
import { MIN_HEIGHT_VIEW } from './constants/gameData';

export const renderPets = (pets, monsterTypes, getColor, hoveredPet, setHoveredPet) => (
  (pets.Goblin.count > 0 ||
    pets.Ogre.count > 0 ||
    pets.Demon.count > 0 ||
    pets.Dragon.count > 0) && (
    <div
      style={{
        marginBottom: '16px',
        backgroundColor: '#e0e0e0',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(pets)
          .filter(([, { count }]) => count > 0)
          .map(([monster, { count, kc }]) => (
            <div key={monster} style={{ textAlign: 'center', margin: '0 auto', position: 'relative' }}>
              <img
                src={`${getItemUrl('pet', monster)}`}
                alt={`${monsterTypes[monster].label} Pet`}
                style={{ width: '50px', height: '50px' }}
                onMouseEnter={() => setHoveredPet(monster)}
                onMouseLeave={() => setHoveredPet(null)}
              />
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: `${getColor(null, monsterTypes[monster].rarity)}`,
                }}
              >
                x{count}
              </div>
              {hoveredPet === monster && (
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
                  {`KC: ${kc.join(', ')}`}
                </div>
              )}
            </div>
          ))}
      </div>
      <span style={{ fontSize: '10px' }}>(1/1,000)</span>
    </div>
  )
);

export const renderLevelAndExperience = (level, experience, experienceToNextLevel) => (
  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
    <div style={{
      width: '100%',
      backgroundColor: 'rgb(50, 50, 50)',
      overflow: 'hidden',
      position: 'relative',
      height: '14px'
    }}>
      <div
        style={{
          width: `${(experience / experienceToNextLevel(level)) * 100}%`,
          height: '100%',
          backgroundColor: 'rgb(200, 180, 0)',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 1
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        padding: '0 5px',
        zIndex: 2
      }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'white' }}>
          Lv.{level}
        </div>
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'white' }}>
          {experience} / {experienceToNextLevel(level)} XP
        </div>
      </div>
    </div>
  </div>
);

export const renderInventory = (inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode) => (
  <div>
    <InventoryGrid
      items={inventory}
      onEquip={equipItem}
      onUsePotion={usePotion}
      onUseCrystal={useCrystal}
      onRecycle={handleRecycle}
      recycleMode={recycleMode}
    />
  </div>
);

export const renderShop = (inventory, inventoryFull, purchaseItem, purchaseNotification) => (
  <div style={{
    minHeight: MIN_HEIGHT_VIEW,
  }}>
    <Shop
      gold={inventory.Gold}
      inventoryFull={inventoryFull}
      onPurchase={purchaseItem}
    />
    {purchaseNotification && (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000,
        }}
      >
        Purchase successful!
      </div>
    )}
  </div>
);

export const renderEquipment = (equipment, unequipItem) => (
  <div>
    <WornEquipment equipment={equipment} onUnequip={unequipItem} />
  </div>
);

export const renderRecycler = (inventory, inventoryFull, scrap, handleRecycle, handleExchange, recycleMode, toggleRecycleMode, equipment, unequipItem) => (
  <div style={{
    minHeight: MIN_HEIGHT_VIEW,
  }}>
    <Recycler
      inventory={inventory}
      inventoryFull={inventoryFull}
      scrap={scrap}
      onRecycle={handleRecycle}
      onExchange={handleExchange}
      recycleMode={recycleMode}
      toggleRecycleMode={toggleRecycleMode}
      equipment={equipment}
      onUnequip={unequipItem}
    />
  </div>
);

export const renderBank = () => (
  <div style={{
    minHeight: MIN_HEIGHT_VIEW,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  }}>
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>
      🏦💰💵🪙
    </div>
    <h2>Bank</h2>
    <p style={{ fontSize: '24px', fontStyle: 'italic', color: '#666' }}>Coming soon™️</p>
  </div>
);

export const renderPond = () => (
  <div style={{
    minHeight: MIN_HEIGHT_VIEW,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  }}>
    <div style={{ fontSize: '48px', marginBottom: '20px' }}>
      🎣🐟🌊🚣
    </div>
    <h2>Pond</h2>
    <p style={{ fontSize: '24px', fontStyle: 'italic', color: '#666' }}>Coming soon™️</p>
  </div>
);

export const renderMobileView = (props) => {
  const {
    currentMonster,
    monsterTypes,
    monsterHitpoints,
    handleMonsterClick,
    isMonsterClickable,
    handleMonsterDied,
    spawnNewMonster,
    lastAttack
  } = props;

  return (
    <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#f0f0f0' }}>
      <Area monster={currentMonster}>
        <MonsterAnimation
          monster={currentMonster}
          hitpoints={monsterHitpoints}
          maxHP={monsterTypes[currentMonster].maxHP}
          onMonsterClick={handleMonsterClick}
          isClickable={isMonsterClickable}
          handleMonsterDied={handleMonsterDied}
          spawnNewMonster={spawnNewMonster}
          experienceGained={monsterTypes[currentMonster].experience}
          lastAttack={lastAttack}
        />
      </Area>
      <p style={{ marginTop: '20px', fontSize: '16px' }}>
        No support for mobile devices yet.
      </p>
    </div>
  );
};

export const renderTown = (goToLocation) => <Town goToLocation={goToLocation} />;

export const renderLevelUpButton = (openSkillTree) => (
  <button
    onClick={openSkillTree}
    style={{
      position: 'absolute',
      bottom: '23px',
      left: '10px',
      padding: '10px',
      backgroundColor: '#c8b400',
      color: 'black',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.target.style.color = 'white';
      e.target.style.backgroundColor = '#a68d00';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.target.style.color = 'black';
      e.target.style.backgroundColor = '#c8b400';
      e.target.style.transform = 'scale(1)';
    }}
  >
    Level Up!
  </button>
);

export const renderSkillTree = (closeSkillTree) => (
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
  >
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '30px 40px',
        borderRadius: '10px',
      }}
    >
      <h2 style={{ color: '#333', fontSize: '2em', textAlign: 'center', margin: '5px 0' }}>Skill Tree</h2>
      <p style={{ color: '#666', fontSize: '1em', textAlign: 'center', margin: '0 0 20px 0' }}>Coming soon™️</p>
      <button onClick={closeSkillTree}>Close</button>
    </div>
  </div>
);

export const renderDeathScreen = (handleContinue) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.5s ease-in-out',
    }}
  >
    <div style={{ transform: 'translateY(-30px)' }}>
      <h2 style={{ color: 'white', fontSize: '2em', margin: '0 0 10px 0' }}>Sit rat 🐀</h2>
      <button
        onClick={handleContinue}
        style={{
          padding: '10px 20px',
          fontSize: '1em',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Continue
      </button>
    </div>
  </div>
);