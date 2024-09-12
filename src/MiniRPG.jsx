/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react';
import useInventoryManager from './hooks/useInventoryManager';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import NavigationArrow from './components/NavigationArrow';
import TimerDisplay from './components/TimerDisplay';
import { monsterTypes, petDropRates, FIRE_LENGTH, ATTACK_SPEED } from './constants/gameData';
import './styles.css';
import {
  getColor,
  getRarityStat,
  getItemUrl,
  calcItemDropRate,
  xpToNextLevel,
  calcWinRate,
  compareRarity,
  calcAccuracy,
  calcMonsterAccuracy,
  calcStats,
} from './utils';
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
  renderDeathScreen,
  renderStats,
} from './renderFunctions';


const MiniRPG = () => {
  const {
    inventory,
    bankItems,
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
    depositItem,
    withdrawItem,
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
  const [userHitpoints, setUserHitpoints] = useState(10);
  const [maxUserHitpoints, setMaxUserHitpoints] = useState(10);
  const [userIsDead, setUserIsDead] = useState(false);
  const [userDeaths, setUserDeaths] = useState(0);
  const [fire, setFire] = useState(false);
  const [fireTimer, setFireTimer] = useState(0);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const toggleDetailedStats = () => {
    setShowDetailedStats(!showDetailedStats);
  };

  const lightFire = useCallback((logItem) => {
    if (!fire && logItem) {
      removeItem('Logs', logItem);
      setFire(true);
      setFireTimer(FIRE_LENGTH);
      setTimeout(() => {
        setFire(false);
        setFireTimer(0);
      }, FIRE_LENGTH * 1000);
    }
  }, [fire, removeItem]);

  useEffect(() => {
    let interval;
    if (fireTimer > 0) {
      interval = setInterval(() => {
        setFireTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fireTimer]);

  const [monsterAnimationState, setMonsterAnimationState] = useState('walking');
  const handleAnimationStateChange = (newState) => {
    setMonsterAnimationState(newState);
  };

  const userHitpointsRef = useRef(userHitpoints);
  useEffect(() => {
    userHitpointsRef.current = userHitpoints;
  }, [userHitpoints]);

  useEffect(() => { // Passive health regeneration
    const healthRegenInterval = setInterval(() => {
      if (!userIsDead && userHitpointsRef.current < maxUserHitpoints) {
        setUserHitpoints(prevHp => Math.min(prevHp + 1, maxUserHitpoints));
      }
    }, 10000);

    return () => clearInterval(healthRegenInterval);
  }, [userHitpointsRef, maxUserHitpoints]);

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

  const [scale, setScale] = useState(1);
  const [alignToTop, setAlignToTop] = useState(false);

  useEffect(() => { // Resize scaling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width > 800) {
        const widthScale = width / 800;
        const heightScale = height / 350;
        setScale(Math.max(1, Math.min(widthScale, heightScale)));
      } else {
        setScale(1);
      }
      setAlignToTop(height < 350);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial scale

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    } else if (item === 'Logs' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Logs', { name: 'Logs', rarity: 'Logs' });
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
    const newItem = { name: itemName, rarity, stat: getRarityStat(rarity) };
    if (!equipment[itemName] || compareRarity(rarity, equipment[itemName].rarity) > 0) {
      equipItem(newItem, null);
    } else {
      addItem(itemName, newItem);
    }
  };

  const handleUpgradeSlot = (slotName, newRarity) => {
    const currentItem = equipment[slotName];
    if (currentItem && scrap[newRarity] >= 2) {
      removeScrap(newRarity, 2);
      const upgradedItem = { 
        ...currentItem, 
        rarity: newRarity, 
        stat: getRarityStat(newRarity) 
      };
      equipItem(upgradedItem, slotName);
    }
  };

  const handleDeposit = (category, item) => {
    depositItem(category, item);
  };

  const handleWithdraw = (category, item) => {
    if (Object.keys(inventory).length < 16) {
      withdrawItem(category, item);
    } else {
      console.log("Inventory is full. Cannot withdraw item.");
    }
  };

  const handleDrop = useCallback((item) => {
    if (item && item.name) {
      removeItem(item.name, item);
    }
  }, [removeItem]);

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const isSoundEnabledRef = useRef(true);
  const attack1Sound = useRef(new Audio('/coinflip/assets/sounds/attack1.ogg'));
  const attack2Sound = useRef(new Audio('/coinflip/assets/sounds/attack2.mp3'));
  const getPetSound = useRef(new Audio('/coinflip/assets/sounds/getPet.ogg'));
  const fireworksSound = useRef(new Audio('/coinflip/assets/sounds/fireworks.ogg'));
  const deathSound = useRef(new Audio('/coinflip/assets/sounds/death.mp3'));


  useEffect(() => {
    isSoundEnabledRef.current = isSoundEnabled;
    attack1Sound.current.volume = 0.1;
    attack2Sound.current.volume = 0.1;
    getPetSound.current.volume = 0.1;
    fireworksSound.current.volume = 0.05;
    deathSound.current.volume = 0.05;
  }, [isSoundEnabled]);

  const playSound = (sound) => {
    if (isSoundEnabledRef.current) {
      sound.currentTime = 0;
      sound.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  const playDeathSound = () => {
    playSound(deathSound.current);
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
    updateCurrency('Gold', 1);
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

  const handleUserDied = () => {
    setIsFighting(false);
    setIsAttacking(false);
    setUserIsDead(true);
    setUserDeaths(prevDeaths => prevDeaths + 1);
    playDeathSound();
  };

  const handleContinue = () => {
    setUserIsDead(false);
    setUserHitpoints(maxUserHitpoints);
  };

  const potionTimerRef = useRef(potionTimer);

  useEffect(() => { // Potion timer reference
    potionTimerRef.current = potionTimer;
  }, [potionTimer]);

  const [lastAttack, setLastAttack] = useState({ damage: null, id: null });

  useEffect(() => { // Fight Monster effect
    const performAttack = () => {
      // User attack
      const userAdjustedRate = calcWinRate(calcStats(equipment), monsterTypes[currentMonster].rate);
      const userResult = Math.random() < userAdjustedRate;
      setResult(userResult);

      setIsAttacking(true);
      playAttackSound(userResult);

      const userDamage = userResult
        ? (1 + Math.floor(calcStats(equipment) / 10)) * (potionTimerRef.current > 0 ? 2 : 1)
        : 0;

      setLastAttack({ damage: userDamage, id: Date.now() });

      if (userResult) {
        setMonsterHitpoints((prevHp) => {
          const newHp = prevHp - userDamage;
          if (newHp <= 0) {
            setIsDying(true);
          }
          return newHp;
        });
      }

      // Monster attack
      const monsterAdjustedRate = calcMonsterAccuracy(monsterTypes[currentMonster].attack, calcStats(equipment));
      const monsterResult = Math.random() < monsterAdjustedRate;

      if (monsterResult) {
        const monsterDamage = monsterTypes[currentMonster].damage;
        setUserHitpoints((prevHp) => {
          const newHp = Math.max(0, prevHp - monsterDamage);
          if (newHp <= 0) {
            handleUserDied();
          }
          return newHp;
        });
      }

      setTimeout(() => {
        setIsAttacking(false);
        setAnimationResult(userResult);

        setScores((prevScores) => ({
          ...prevScores,
          [currentMonster]: {
            fights: prevScores[currentMonster].fights + 1,
            wins: prevScores[currentMonster].wins + (userResult ? 1 : 0),
          },
        }));

      }, 300);
    };

    if (isFighting) {
      performAttack();
      fightIntervalRef.current = setInterval(performAttack, ATTACK_SPEED);
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
      setMaxUserHitpoints(prevMax => prevMax + 2);
      setUserHitpoints(prevHp => prevHp + 2);
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
        {renderInventory(inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode, handleDrop, scale, lightFire)}
        </div>
        <div style={{ width: '50%', maxWidth: '400px', position: 'relative' }}>
          <TimerDisplay crystalTimer={crystalTimer} potionTimer={potionTimer} fireTimer={fireTimer} />
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
              isFighting={isFighting}
              onAnimationStateChange={handleAnimationStateChange}
            />
            {currentMonster !== 'Goblin' && (
              <NavigationArrow
                direction="left"
                onClick={() => navigateMonster('left')}
                disabled={isFighting || monsterAnimationState === 'dying'}
              />
            )}
            {currentMonster !== 'Dragon' && (
              <NavigationArrow
                direction="right"
                onClick={() => navigateMonster('right')}
                disabled={isFighting || monsterAnimationState === 'dying'}
              />
            )}
          </Area>
          {renderLevelAndExperience(level, experience, xpToNextLevel)}
          {renderPets(pets, monsterTypes, getColor, hoveredPet, setHoveredPet)}
          {showLevelUpButton && renderLevelUpButton(openSkillTree)}
          {showSkillTree && renderSkillTree(closeSkillTree)}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '14px',
            color: 'white',
          }}>
            HP: {userHitpoints} / {maxUserHitpoints}
          </div>
          {fire && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <img src={getItemUrl('fire')} alt='fire' style={{ width: '100px', height: '100px' }} />
            </div>
          )}
        </div>
        
        <div style={{ width: '25%', maxWidth: '200px', paddingTop: '10px' }}>
          {renderEquipment(equipment, unequipItem)}
          <div
            style={{
              margin: '0',
              textAlign: 'center',
              fontStyle: 'italic',
              fontSize: '0.6em',
              padding: '1em 5em 0 5em',
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={toggleDetailedStats}
            >
              <span style={{ fontSize: '1em' }}>Total Stats:</span>
              <span style={{ fontSize: '1.2em', fontWeight: 'bold', marginLeft: '5px' }}>
                {calcStats(equipment)}
              </span>
              <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>
                {showDetailedStats ? '▲' : '▼'}
              </span>
            </div>
            {showDetailedStats && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', }}>
                  <span style={{ fontSize: '0.8em' }}>Accuracy:</span>
                  <span style={{ fontSize: '1em' }}>
                    {(calcAccuracy(calcStats(equipment), monsterTypes[currentMonster]) * 100).toFixed(2)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', }}>
                  <span style={{ fontSize: '0.8em' }}>Drop rate:</span>
                  <span style={{ fontSize: '1em' }}>
                    {calcItemDropRate(0.1, monsterTypes[currentMonster].modifier, crystalTimer).toFixed(2)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', }}>
                  <span style={{ fontSize: '0.8em' }}>Monster accuracy:</span>
                  <span style={{ fontSize: '1em' }}>
                    {(calcMonsterAccuracy(monsterTypes[currentMonster].attack, calcStats(equipment)) * 100).toFixed(2)}%
                  </span>
                </div>
              </>
            )}
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
      setIsFighting(false);
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
          return renderRecycler(inventory, inventoryFull, scrap, handleRecycle, recycleMode, toggleRecycleMode, equipment, equipItem, unequipItem, handleUpgradeSlot);
        case 'shop':
          return renderShop(inventory, inventoryFull, purchaseItem, purchaseNotification);
        case 'bank':
          return renderBank(inventory, bankItems, handleDeposit, handleWithdraw);
        case 'pond':
          return renderPond();
        case 'stats':
          return renderStats(killCount, scores, pets, userDeaths);
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
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: alignToTop ? 'flex-start' : 'center',
      overflow: 'hidden',
    }}>
      {userIsDead && renderDeathScreen(handleContinue)}
      <div style={{
        width: '800px',
        transform: `scale(${scale})`,
        transformOrigin: alignToTop ? 'top center' : 'center center',
        transition: 'opacity 0.2s',
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
            marginTop: '10px',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#b0b0b0',
          }}
        >
          v1.10.7 - <a href='https://alan.computer'
            style={{
              color: '#b0b0b0',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}>alan.computer</a>
        </div>
      </div>
    </div>
  );
};

export default MiniRPG;
