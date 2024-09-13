import React from 'react';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import InventoryGrid from './components/InventoryGrid';
import Town from './components/Town';
import Bank from './components/Bank';
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
        padding: '10px',
        borderRadius: '5px',
        fontSize: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(pets)
          .filter(([, { count }]) => count > 0)
          .map(([monster, { count, kc }]) => (
            <div key={monster} style={{ textAlign: 'center', margin: '0 auto', position: 'relative' }}>
              <img
                src={`${getItemUrl('pet', monster)}`}
                alt={`${monsterTypes[monster].label}`}
                style={{ width: '30px', height: '30px' }}
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

export const renderInventory = (inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode, handleDrop, scale, lightFire) => (
  <div>
    <InventoryGrid
      items={inventory}
      onEquip={equipItem}
      onUsePotion={usePotion}
      onUseCrystal={useCrystal}
      onRecycle={handleRecycle}
      recycleMode={recycleMode}
      onDrop={handleDrop}
      scale={scale}
      onLightFire={lightFire}
    />
  </div>
);

export const renderShop = (inventory, inventoryFull, purchaseItem, purchaseNotification) => (
  <div style={{  // TODO: factor out parent div?
    minHeight: MIN_HEIGHT_VIEW,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

export const renderRecycler = (inventory, inventoryFull, scrap, handleRecycle, recycleMode, toggleRecycleMode, equipment, equipItem, unequipItem, handleUpgradeSlot) => (
  <div style={{  // TODO: factor out parent div?
    minHeight: MIN_HEIGHT_VIEW,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Recycler
      inventory={inventory}
      inventoryFull={inventoryFull}
      scrap={scrap}
      onRecycle={handleRecycle}
      recycleMode={recycleMode}
      toggleRecycleMode={toggleRecycleMode}
      equipment={equipment}
      onEquip={equipItem}
      onUnequip={unequipItem}
      onUpgradeSlot={handleUpgradeSlot}
    />
  </div>
);

export const renderBank = (inventory, bankItems, handleDeposit, handleWithdraw) => (
  <Area monster="Bank">
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: MIN_HEIGHT_VIEW,
    }}>
      <Bank
        inventory={inventory}
        bankItems={bankItems}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    </div>
  </Area>
);

export const renderPond = () => (
  <Area monster="Pond">
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: MIN_HEIGHT_VIEW,
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        🎣🐟🌊🚣
      </div>
      <h2 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Pond</h2>
      <p style={{ fontSize: '24px', fontStyle: 'italic', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Coming soon™️</p>
    </div>
  </Area>
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
    <div style={{ width: '100%', textAlign: 'center', color: '#f0f0f0' }}>
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
        No support for mobile devices yet.<br />
        Landscape mode might work, but is untested.
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
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.5s ease-in-out',
    }}
  >
    <div style={{ transform: 'translateY(-25px)' }}>
      <h2 style={{ color: 'white', fontSize: '2em', margin: '0 0 10px 0' }}>You died 💀</h2>
      <button
        onClick={handleContinue}
        style={{
          padding: '10px 20px',
          fontSize: '1.5em',
          fontFamily: 'monospace',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Continue?
      </button>
    </div>
  </div>
);

export const renderStats = (killCount, scores, pets, userDeaths) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flexBasis: '30%', minWidth: '200px' }}>
          <h3 style={{ color: '#444', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Monster Kills</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(killCount).map(([monster, count]) => (
              <li key={monster} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span>{monster}:</span> <span style={{ fontWeight: 'bold' }}>{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flexBasis: '30%', minWidth: '200px' }}>
          <h3 style={{ color: '#444', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Fight Scores</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(scores).map(([monster, { fights, wins }]) => (
              <li key={monster} style={{ padding: '3px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{monster}:</span>
                  <span style={{ fontWeight: 'bold' }}>{wins}/{fights}</span>
                </div>
                <div style={{ fontSize: '0.8em', color: '#666', textAlign: 'right' }}>
                  ({fights > 0 ? ((wins / fights) * 100).toFixed(1) : 0}% win)
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flexBasis: '30%', minWidth: '200px' }}>
          <h3 style={{ color: '#444', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>Pets Collected</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {Object.entries(pets).map(([monster, { count, kc }]) => (
              <li key={monster} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span>{monster}:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {count} {count > 0 && <span style={{ fontSize: '0.8em', color: '#666' }}>({kc.join(', ')})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        Total Deaths: <span style={{ fontWeight: 'bold' }}>{userDeaths}</span>
      </div>
    </div>
  );
};