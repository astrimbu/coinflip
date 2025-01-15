import React from 'react';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import InventoryGrid from './components/InventoryGrid';
import Town from './components/Town';
import Bank from './components/Bank';
import Shop from './components/Shop';
import WornEquipment from './components/WornEquipment';
import Recycler from './components/Recycler';
import { MIN_HEIGHT_VIEW } from './constants/gameData';
import AutoToggle from './components/AutoToggle';
import Tree from './components/Tree';

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
                src={`/coinflip/assets/monsters/${monster.toLowerCase()}.png`}
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

export const renderLevelAndExperience = (level, experience, experienceToNextLevel, autoUnlocked, autoMode, onAutoToggle, isAutoHighlighted) => (
  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
    <AutoToggle 
      isEnabled={autoMode}
      onToggle={onAutoToggle}
      isUnlocked={autoUnlocked}
      isHighlighted={isAutoHighlighted}
    />
    
    {/* XP Bar */}
    <div 
      style={{
        width: '100%',
        backgroundColor: 'rgb(50, 50, 50)',
        overflow: 'hidden',
        position: 'relative',
        height: '14px',
      }}
      title={`${experienceToNextLevel(level) - experience} XP needed for next level`}
    >
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
          {experience} XP
        </div>
      </div>
    </div>
  </div>
);

export const renderInventory = (inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode, handleDrop, scale, lightFire, useTuna, isHighlightingFirstSlot, handleTutorialEquip, isHighlightingPotion) => (
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
      onUseTuna={useTuna}
      isHighlightingFirstSlot={isHighlightingFirstSlot}
      onTutorialEquip={handleTutorialEquip}
      isHighlightingPotion={isHighlightingPotion}
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

export const renderBank = (inventory, bankItems, handleDeposit, handleWithdraw, depositAll) => (
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
        depositAll={depositAll}
      />
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
    handleMonsterRespawn,
    lastAttack,
    overrideMobileView,
    onAnimationStateChange,
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
          handleMonsterRespawn={handleMonsterRespawn}
          experienceGained={monsterTypes[currentMonster].experience}
          lastAttack={lastAttack}
          onAnimationStateChange={onAnimationStateChange}
        />
      </Area>
      <p style={{ marginTop: '20px', fontSize: '16px' }}>
        No support for mobile devices yet.<br />
        Landscape mode might work, but is untested.
      </p>
      <button
        onClick={overrideMobileView}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Load anyway
      </button>
    </div>
  );
};

export const renderTown = (goToLocation, isHighlightingMonster) => <Town goToLocation={goToLocation} isHighlightingMonster={isHighlightingMonster} />;

export const renderTree = (closeTree, onSelectUpgrade, playerStats) => (
  <Tree 
    onClose={closeTree}
    onSelectUpgrade={onSelectUpgrade}
    playerStats={playerStats}
  />
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
