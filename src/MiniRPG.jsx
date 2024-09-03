/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react';
import useInventoryManager from './hooks/useInventoryManager';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation'
import NavigationArrow from './components/NavigationArrow';
import { getColor, getRarityStat, getItemUrl, calcWinRate, calcItemDropRate, xpToNextLevel } from './utils';
import { monsterTypes, petDropRates } from './constants/gameData';
import './styles.css';
import {
  renderPets,
  renderLevelAndExperience,
  renderInventory,
  renderShop,
  renderEquipment,
  renderRecycler,
  renderBank,
  renderPond,
  renderMobileView,
  renderTown,
  renderLevelUpButton,
  renderSkillTree,
} from './renderFunctions';


const MiniRPG = () => {
  const {
    inventory,
    equipment,
    scrap,
    inventoryFull,
    recentItems,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    updateCurrency,
    recycleItems,
    removeScrap,
  } = useInventoryManager();

  const [currentMonster, setCurrentMonster] = useState('Goblin');
  const [scores, setScores] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, { fights: 0, wins: 0 }]))
  );

  const [checkSeed, setCheckSeed] = useState(Math.random());
  const [itemSeed, setItemSeed] = useState(Math.random());
  const [result, setResult] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const fightIntervalRef = useRef(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDying, setIsDying] = useState(false);
  const [monsterHitpoints, setMonsterHitpoints] = useState(monsterTypes[currentMonster].maxHP);
  const [view, setView] = useState('game');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 750);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [crystalTimer, setCrystalTimer] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [potionTimer, setPotionTimer] = useState(0);
  const [animationResult, setAnimationResult] = useState(null);
  const [tickets, setTickets] = useState(0);
  const isMonsterClickable = !isFighting && tickets >= monsterTypes[currentMonster].ticketCost;
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [recycleMode, setRecycleMode] = useState(false);
  const [showLevelUpButton, setShowLevelUpButton] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);

  const handleMonsterClick = () => {
    if (isMonsterClickable) {
      fightMonster();
      setItemSeed(Math.random());
      setCheckSeed(Math.random());
    }
  };

  const [pets, setPets] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, { count: 0, kc: [] }]))
  );
  const [killCount, setKillCount] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, 0]))
  );

  useEffect(() => { // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 750);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateTotalStats = () => {
    return Object.values(equipment).reduce((total, item) => {
      return total + (item && item.stat ? item.stat : 0);
    }, 0);
  };

  const purchaseItem = (item) => {
    if (item === 'Crystal' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Crystal', { name: 'Crystal', rarity: 'Crystal' });
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Potion' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      updateCurrency('Potion', 1);
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    }
  };

  const useCrystal = () => {
    if (inventory.Crystal.length > 0) {
      removeItem('Crystal', inventory.Crystal[0]);
      setCrystalTimer(300);
    }
  };

  const usePotion = () => {
    if (inventory.Potion > 0) {
      updateCurrency('Potion', -1);
      setPotionTimer((prevTimer) => prevTimer + 120);
    }
  };

  useEffect(() => { // Crystal/Potion effect
    let interval;
    if (crystalTimer > 0 || potionTimer > 0) {
      interval = setInterval(() => {
        if (crystalTimer > 0) {
          setCrystalTimer((prevTimer) => prevTimer - 1);
        }
        if (potionTimer > 0) {
          setPotionTimer((prevTimer) => {
            return prevTimer - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [crystalTimer, potionTimer]);

  const handleRecycle = (items) => {
    recycleItems(items);
  };

  const toggleRecycleMode = () => {
    setRecycleMode(!recycleMode);
    document.body.style.cursor = recycleMode ? 'default' : 'grab';
  };

  const handleExchange = (rarity, itemName) => {
    removeScrap(rarity);
    addItem(itemName, { name: itemName, rarity, stat: getRarityStat(rarity) });
  };

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);
  const attack1Sound = useRef(new Audio(new URL('./assets/sounds/attack1.ogg', import.meta.url).href));
  const attack2Sound = useRef(new Audio(new URL('./assets/sounds/attack2.mp3', import.meta.url).href));
  const getPetSound = useRef(new Audio(new URL('./assets/sounds/getPet.ogg', import.meta.url).href));
  const fireworksSound = useRef(new Audio(new URL('./assets/sounds/fireworks.ogg', import.meta.url).href));

  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled;
    fireworksSound.current.volume = 0.1;
  }, [isSoundEnabled]);

  const playSound = (sound) => {
    if (isSoundEnabledRef.current) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  const playAttackSound = (result) => {
    playSound(result ? attack2Sound.current : attack1Sound.current);
  };

  const playPetSound = () => {
    playSound(getPetSound.current);
  };

  const playLevelUpSound = () => {
    playSound(fireworksSound.current);
  };

  const checkForPet = () => {
    const dropRate = petDropRates[currentMonster];
    if (checkSeed < dropRate) {
      setPets((prevPets) => ({
        ...prevPets,
        [currentMonster]: {
          count: prevPets[currentMonster].count + 1,
          kc: [...prevPets[currentMonster].kc, killCount[currentMonster] + 1],
        },
      }));
      playPetSound();
    }
  };

  const checkForItem = () => {
    const baseChance = 0.1;
    const modifier = monsterTypes[currentMonster].modifier;
    const itemChance = baseChance * modifier * (crystalTimer > 0 ? 2 : 1);

    if (checkSeed < itemChance) {
      const items = [
        'Gold',
        'Weapon',
        'Hat',
        'Cape',
        'Body',
        'Pants',
        'Gloves',
        'Boots',
        'Ring',
        'Amulet',
        'Potion',
      ];
      const randomItem = items[Math.floor(itemSeed * items.length)];
      const rarity = monsterTypes[currentMonster].rarity;

      let newItem;
      const extraItems = {
        Goblin: 1,
        Ogre: 2,
        Demon: 3,
        Dragon: 4,
      }[currentMonster];

      if (randomItem === 'Gold' || randomItem === 'Potion') {
        updateCurrency(randomItem, extraItems);
        newItem = { name: randomItem, count: extraItems };
      } else {
        const stat = getRarityStat(rarity);
        newItem = { name: randomItem, rarity, stat };
        addItem(randomItem, newItem);
      }
    }
  };

  const fightMonster = () => {
    const ticketCost = monsterTypes[currentMonster].ticketCost;
    if (tickets < ticketCost) {
      return;
    }
    setTickets((prevTickets) => prevTickets - ticketCost);
    setIsFighting(true);
  };

  const spawnNewMonster = () => {
    setIsDying(false);
    setMonsterHitpoints(monsterTypes[currentMonster].maxHP);
  };

  const handleMonsterDied = () => {
    setIsFighting(false);
    setIsAttacking(false);
    setMonsterHitpoints(0);
    checkForItem();
    checkForPet();
    setTickets((prevTickets) => prevTickets + 10);
    setKillCount((prevKillCount) => ({
      ...prevKillCount,
      [currentMonster]: prevKillCount[currentMonster] + 1,
    }));

    const expGained = monsterTypes[currentMonster].experience;
    setExperience((prevExp) => {
      const newExp = prevExp + expGained;
      const expNeeded = xpToNextLevel(level);
      if (newExp >= expNeeded) {
        handleLevelUp();
        return newExp - expNeeded;
      }
      return newExp;
    });

    spawnNewMonster();
  };

  const potionTimerRef = useRef(potionTimer);

  useEffect(() => {
    potionTimerRef.current = potionTimer;
  }, [potionTimer]);

  const [lastAttack, setLastAttack] = useState({ damage: null, id: null });

  useEffect(() => { // Fight Monster effect
    const performAttack = () => {
      const adjustedRate = calcWinRate(calculateTotalStats(), monsterTypes[currentMonster].rate);
      const result = Math.random() < adjustedRate;
      setResult(result);

      setIsAttacking(true);
      playAttackSound(result);

      const damage = result
        ? (1 + Math.floor(calculateTotalStats() / 10)) * (potionTimerRef.current > 0 ? 2 : 1)
        : 0;

      setLastAttack({ damage, id: Date.now() });

      if (result) {
        setMonsterHitpoints((prevHp) => {
          const newHp = prevHp - damage;
          if (newHp <= 0) {
            setIsDying(true);
          }
          return newHp;
        });
      }

      setTimeout(() => {
        setIsAttacking(false);
        setAnimationResult(result);

        setScores((prevScores) => ({
          ...prevScores,
          [currentMonster]: {
            fights: prevScores[currentMonster].fights + 1,
            wins: prevScores[currentMonster].wins + (result ? 1 : 0),
          },
        }));

      }, 300);
    };

    if (isFighting) {
      performAttack();
      fightIntervalRef.current = setInterval(performAttack, 1200);
    } else {
      clearInterval(fightIntervalRef.current);
    }

    return () => clearInterval(fightIntervalRef.current);
  }, [isFighting, currentMonster]);

  const [hoveredPet, setHoveredPet] = useState(null);

  const navigateMonster = (direction) => {
    const currentOrder = monsterTypes[currentMonster].order;
    const monsterCount = Object.keys(monsterTypes).length;
    let newOrder;

    if (direction === 'left') {
      newOrder = (currentOrder - 1 + monsterCount) % monsterCount;
    } else {
      newOrder = (currentOrder + 1) % monsterCount;
    }

    const newMonster = Object.keys(monsterTypes).find(monster => monsterTypes[monster].order === newOrder);
    setCurrentMonster(newMonster);
    setMonsterHitpoints(monsterTypes[newMonster].maxHP);
  };

  const handleLevelUp = () => {
    setLevel((prevLevel) => {
      const newLevel = prevLevel + 1;
      setShowLevelUpButton(true);
      playLevelUpSound();
      return newLevel;
    });
  };

  const openSkillTree = () => {
    setShowSkillTree(true);
    setShowLevelUpButton(false);
  };

  const closeSkillTree = () => {
    setShowSkillTree(false);
  };

  const renderGame = () => (
    <div id='renderGame'
      style={{
        width: '100%',
        margin: '0 auto',
        background: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <button
        onClick={toggleSound}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '0',
        }}
      >
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ width: '25%', maxWidth: '200px', paddingTop: '10px' }}>
        {renderInventory(inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode)}
        </div>
        <div style={{ width: '50%', maxWidth: '400px', position: 'relative' }}>
          {(crystalTimer > 0 || potionTimer > 0) && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                gap: '10px',
                zIndex: 10,
              }}
            >
              {crystalTimer > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <img
                    src={getItemUrl('crystal', 'Crystal')}
                    alt="Crystal"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {Math.floor(crystalTimer / 60)}:
                    {(crystalTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              {potionTimer > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <img
                    src={getItemUrl('potion', 'Potion')}
                    alt="Potion"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {Math.floor(potionTimer / 60)}:
                    {(potionTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          )}
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
            {currentMonster !== 'Goblin' && (
              <NavigationArrow
                direction="left"
                onClick={() => navigateMonster('left')}
                disabled={isFighting}
              />
            )}
            {currentMonster !== 'Dragon' && (
              <NavigationArrow
                direction="right"
                onClick={() => navigateMonster('right')}
                disabled={isFighting}
              />
            )}
          </Area>
          {renderLevelAndExperience(level, experience, xpToNextLevel)}
          {renderPets(pets, monsterTypes, getColor, hoveredPet, setHoveredPet)}
          {showLevelUpButton && renderLevelUpButton(openSkillTree)}
          {showSkillTree && renderSkillTree(closeSkillTree)}
        </div>
        <div style={{ width: '25%', maxWidth: '200px', paddingTop: '10px' }}>
          {renderEquipment(equipment, unequipItem)}
          <div
            style={{
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic',
              fontSize: '0.8em',
            }}
          >
            Accuracy: {(calcWinRate(calculateTotalStats(), monsterTypes[currentMonster].rate) * 100).toFixed(2)}% <br />
            Drop rate: {calcItemDropRate(0.1, monsterTypes[currentMonster].modifier, crystalTimer)}%
          </div>
        </div>
      </div>
    </div>
  );

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const [currentLocation, setCurrentLocation] = useState('game');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToTown = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLocation('town');
      setIsTransitioning(false);
    }, 300);
    if (isFighting) {
    }
  }, [isFighting]);
  const goToLocation = useCallback((location) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLocation(location);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const renderCurrentLocation = () => {
    const content = (() => {
      switch (currentLocation) {
        case 'town':
          return renderTown(goToLocation);
        case 'recycler':
          return renderRecycler(inventory, inventoryFull, scrap, handleRecycle, handleExchange, recycleMode, toggleRecycleMode, equipment, unequipItem);
        case 'shop':
          return renderShop(inventory, inventoryFull, purchaseItem, purchaseNotification);
        case 'bank':
          return renderBank();
        case 'pond':
          return renderPond();
        default:
          return renderGame();
      }
    })();

    return (
      <div id='game' style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        background: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {content}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <button
            onClick={goToTown}
            disabled={currentLocation === 'town'}
            style={{
              padding: '10px',
              fontSize: '24px',
              backgroundColor: currentLocation === 'town' ? '#ccc' : '#4CAF50',
              border: 'none',
              borderRadius: '10px',
              cursor: currentLocation === 'town' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🏠
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      width: '100%',
      height: windowHeight > 500 ? '100vh' : 'auto',
      justifyContent: windowHeight > 500 ? 'center' : 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 auto',
      gap: '20px',
      position: 'relative',
      transition: 'opacity 0.3s',
      opacity: isTransitioning ? 0 : 1,
    }}>
      {isDesktop ? renderCurrentLocation() : renderMobileView({
        currentMonster,
        monsterTypes,
        monsterHitpoints,
        handleMonsterClick,
        isMonsterClickable,
        handleMonsterDied,
        spawnNewMonster,
        lastAttack
      })}
      <div
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#b0b0b0',
        }}
      >
        v1.8.14 - <a href='https://alan.computer'
          style={{ color: '#b0b0b0', textDecoration: 'none' }}>alan.computer</a>
      </div>
    </div>
  );
};

export default MiniRPG;
