import React from 'react';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import InventoryGrid from './components/InventoryGrid';
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

export const renderTown = (goToLocation) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    minHeight: MIN_HEIGHT_VIEW,
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginTop: '20px',
    }}>
      {[
        { name: 'Recycler', image: '🔄' },
        { name: 'Shop', image: '🛒' },
        { name: 'Bank', image: '🏦' },
        { name: 'Pond', image: '🎣' },
        { name: 'Monster', image: '👹' },
      ].map((service) => (
        <div
          key={service.name}
          onClick={() => goToLocation(service.name.toLowerCase() === 'monster' ? 'game' : service.name.toLowerCase())}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: service.name === 'Monster' ? '#CD5C5C' : '#ddd',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '10px',
            transition: 'background-color 0.3s, transform 0.3s',
            transform: service.name === 'Monster' ? 'scale(1.1)' : 'scale(1)',
            boxShadow: service.name === 'Monster' ? '0 0 15px rgba(0,0,0,0.2)' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = service.name === 'Monster' ? '#A52A2A' : '#bbb';
            e.currentTarget.style.transform = service.name === 'Monster' ? 'scale(1.15)' : 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = service.name === 'Monster' ? '#CD5C5C' : '#ddd';
            e.currentTarget.style.transform = service.name === 'Monster' ? 'scale(1.1)' : 'scale(1)';
          }}
        >
          <div style={{ fontSize: '48px' }}>{service.image}</div>
          <div style={{ color: service.name === 'Monster' ? 'white' : 'black', fontWeight: service.name === 'Monster' ? 'bold' : 'normal' }}>
            {service.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);
