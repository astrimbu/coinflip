import React from 'react';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import InventoryGrid from './components/InventoryGrid';
import Town from './components/Town';
import Bank from './components/Bank';
import Shop from './components/Shop';
import WornEquipment from './components/WornEquipment';
import Recycler from './components/Recycler';
import Grid from './components/Grid';
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

export const renderLevelAndExperience = (level, experience, experienceToNextLevel, autoUnlocked, autoMode, onAutoToggle) => (
  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
    {/* Auto Toggle */}
    <AutoToggle 
      isEnabled={autoMode}
      onToggle={onAutoToggle}
      isUnlocked={autoUnlocked}
    />
    
    {/* XP Bar */}
    <div style={{
      width: '100%',
      backgroundColor: 'rgb(50, 50, 50)',
      overflow: 'hidden',
      position: 'relative',
      height: '14px',
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

export const renderPond = (showCapybara) => {
  return (
    <Area monster="Pond">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: MIN_HEIGHT_VIEW,
        position: 'relative',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
        🎣🐟🌊🚣
        </div>
        <h2 style={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Pond</h2>
        <p style={{ fontSize: '24px', fontStyle: 'italic', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Coming soon™️</p>
        {showCapybara && (
          <img
            key={Date.now()}
            src="/coinflip/assets/backgrounds/capybara.gif"
            alt="Capybara"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '200px',
              maxHeight: '200px',
            }}
          />
        )}
      </div>
    </Area>
  );
};

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

export const renderSettings = (inventoryBackground, setInventoryBackground, equipmentBackground, setEquipmentBackground, toggleSettings) => {
  const backgroundOptions = ['i'];
  const equipOptions = ['e'];

  const ImageOption = ({ src, current, onClick }) => (
    <div
      onClick={onClick}
      style={{
        width: '100px',
        height: '100px',
        backgroundImage: `url('/coinflip/assets/backgrounds/${src}.png')`,
        backgroundSize: 'cover',
        outline: current === src ? '5px solid black' : '5px solid transparent',
        borderRadius: '5px',
        margin: '5px',
        cursor: 'pointer',
      }}
    />
  );

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -55%)',
      backgroundColor: 'rgb(235 221 178)',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: 1000,
    }}>
      <h2 style={{margin: '0 0 20px 0'}}>Settings</h2>
      <div>
        <h4 style={{margin: '10px 0 0 0'}}>Inventory Background:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {backgroundOptions.map(option => (
            <ImageOption
              key={option}
              src={option}
              current={inventoryBackground}
              onClick={() => setInventoryBackground(option)}
            />
          ))}
        </div>
      </div>
      <div>
        <h4 style={{margin: '10px 0 0 0'}}>Equipment Background:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {equipOptions.map(option => (
            <ImageOption
              key={option}
              src={option}
              current={equipmentBackground}
              onClick={() => setEquipmentBackground(option)}
            />
          ))}
        </div>
      </div>
      <span 
        onClick={toggleSettings}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '0',
          color: '#111',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          lineHeight: '1',
          fontSize: '2em',
        }}
      >
        ✖
      </span>
    </div>
  );
};

export const renderGrid = () => {
  return (
    <div style={{
      minHeight: MIN_HEIGHT_VIEW,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <Grid />
    </div>
  );
};