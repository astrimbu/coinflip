/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react';
import useInventoryManager from './hooks/useInventoryManager';
import Area from './components/Area';
import MonsterAnimation from './components/MonsterAnimation';
import NavigationArrow from './components/NavigationArrow';
import TimerDisplay from './components/TimerDisplay';
import StatsInfo from './components/StatsInfo';
import Tutorial from './components/Tutorial';
import TutorialCompletionCertificate from './components/TutorialCompletionCertificate';
import { monsterTypes, petDropRates, FIRE_LENGTH, ATTACK_SPEED } from './constants/gameData';
import './styles.css';
import {
  getColor,
  getRarityStat,
  getItemUrl,
  xpToNextLevel,
  calcWinRate,
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
  renderSettings,
  renderGrid,
} from './renderFunctions';


const MiniRPG = () => {
  const {
    inventory,
    bankItems,
    equipment,
    scrap,
    inventoryFull,
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
  const [isFighting, setIsFighting] = useState(false);
  const fightIntervalRef = useRef(null);
  const [monsterHitpoints, setMonsterHitpoints] = useState(monsterTypes[currentMonster].maxHP);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 750);
  const [crystalTimer, setCrystalTimer] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [potionTimer, setPotionTimer] = useState(0);
  const [tickets, setTickets] = useState(0);
  const isMonsterClickable = !isFighting && tickets >= monsterTypes[currentMonster].ticketCost;
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [recycleMode, setRecycleMode] = useState(false);
  const [showLevelUpButton, setShowLevelUpButton] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [userHitpoints, setUserHitpoints] = useState(10);
  const [maxUserHitpoints, setMaxUserHitpoints] = useState(10);
  const [damageFlash, setDamageFlash] = useState(false);
  const [isLowHP, setIsLowHP] = useState(false);
  const [userIsDead, setUserIsDead] = useState(false);
  const [userDeaths, setUserDeaths] = useState(0);
  const [fire, setFire] = useState({ isLit: false, lastUpdated: Date.now() });
  const [fireTimer, setFireTimer] = useState(0);
  const fireTimeoutRef = useRef(null);
  const isFightingRef = useRef(false);
  const [monsterAnimationState, setMonsterAnimationState] = useState('walking');
  const [showSettings, setShowSettings] = useState(false);
  const [inventoryBackground, setInventoryBackground] = useState('inventory');
  const [equipmentBackground, setEquipmentBackground] = useState('equip');
  const [showCapybara, setShowCapybara] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    damageBonus: 0,
    regenerationMultiplier: 1,
  });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const isHighlightingFirstSlot = showTutorial && tutorialStep === 2;
  const isHighlightingPotion = showTutorial && tutorialStep === 3;
  const isHighlightingMonster = showTutorial && tutorialStep === 4;
  const [showTutorialCompletion, setShowTutorialCompletion] = useState(false);

  const getTutorialText = () => {
    if (showTutorial && tutorialStep === 1) {
      return "This is the monster's health bar.";
    }
    return null;
  };

  const getTutorialPositions = () => {
    switch (tutorialStep) {
      case 1: // Fighting...
        return {
          main: {
            top: 'calc(50% + 90px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
          additional: [
            {
              top: 'calc(100% - 120px)',
              left: '70%',
              transform: 'translate(-50%, 0)',
              text: 'This is your health bar.',
            },
          ],
        };
      case 2: // Equip item
        return {
          main: {
            top: '100px',
            left: '30px',
            transform: 'none',
          },
        };
      case 3: // Potion
        return {
          main: {
            top: '60px',
            left: '110px',
            transform: 'none',
          },
        };
      case 4: // Town
        return {
          main: {
            top: 'calc(100% - 85px)',
            left: '75px',
            transform: 'none',
          },
        };
      default:
        return {
          main: {
            top: 'calc(50% + 90px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        };
    }
  };

  const handleTutorialEquip = () => {
    if (showTutorial && tutorialStep === 2) {
      setTutorialStep(tutorialStep + 1);
    }
  };
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setShowTutorialCompletion(true);
  };
  const handleCloseTutorialCompletion = () => {
    setShowTutorialCompletion(false);
  };
  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handleSelectSkill = (skill) => {
    if (skill === 'damage') {
      setPlayerStats(prevStats => ({
        ...prevStats,
        damageBonus: prevStats.damageBonus + 1,
      }));
    } else if (skill === 'regeneration') {
      setPlayerStats(prevStats => ({
        ...prevStats,
        regenerationMultiplier: prevStats.regenerationMultiplier * 2,
      }));
    }
    closeSkillTree();
  };

  const useTuna = () => {
    if (inventory.Tuna.length > 0) {
      removeItem('Tuna', inventory.Tuna[0]);
      setUserHitpoints(prevHp => Math.min(prevHp + 10, maxUserHitpoints));
    }
  };

  useEffect(() => { // Pond capybara
    const interval = setInterval(() => {
      setShowCapybara(true);
      setTimeout(() => setShowCapybara(false), 7200);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleAnimationStateChange = (newState) => {
    setMonsterAnimationState(newState);
  };

  const handleMonsterClick = () => {
    if (isMonsterClickable) {
      if (showTutorial && tutorialStep === 0) {
        setTutorialStep(1);
        setItemSeed(0.1);
        setCheckSeed(0.1);
      } else {
        setItemSeed(Math.random());
        setCheckSeed(Math.random());
      }
      fightMonster();
    }
  };

  useEffect(() => { // Low HP effect
    setIsLowHP(userHitpoints < maxUserHitpoints * 0.3);
  }, [userHitpoints, maxUserHitpoints]);

  useEffect(() => { // Fire state sanity check
    if (fire.isLit && fireTimer === 0) {
      console.warn('Inconsistent state: Fire is lit but timer is 0');
      extinguishFire();
    } else if (!fire.isLit && fireTimer > 0) {
      console.warn('Inconsistent state: Fire is not lit but timer is > 0');
    }
  }, [fire.isLit, fireTimer]);

  const lightFire = useCallback((logItem) => {
    if (!fire.isLit && logItem) {
      removeItem('Logs', logItem);
      setFire({ isLit: true, lastUpdated: Date.now() });
      setFireTimer(FIRE_LENGTH);
  
      if (fireTimeoutRef.current) {
        clearTimeout(fireTimeoutRef.current);
      }
  
      fireTimeoutRef.current = setTimeout(() => {
        setFire({ isLit: false, lastUpdated: Date.now() });
        setFireTimer(0);
        fireTimeoutRef.current = null;
      }, FIRE_LENGTH * 1000);
    } else if (fire.isLit && logItem) {
      removeItem('Logs', logItem);
      setFireTimer(prevTimer => prevTimer + 60);
      
      if (fireTimeoutRef.current) {
        clearTimeout(fireTimeoutRef.current);
      }
  
      fireTimeoutRef.current = setTimeout(() => {
        setFire({ isLit: false, lastUpdated: Date.now() });
        setFireTimer(0);
        fireTimeoutRef.current = null;
      }, (fireTimer + 60) * 1000);
    }
  }, [fire.isLit, removeItem, fireTimer]);

  const extinguishFire = () => {
    setFire({isLit: false});
    setFireTimer(0);
    if (fireTimeoutRef.current) {
      clearTimeout(fireTimeoutRef.current);
    }
  }

  useEffect(() => { // Fire timeout
    return () => {
      if (fireTimeoutRef.current) {
        clearTimeout(fireTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => { // Fire timer
    let interval;
    if (fireTimer > 0) {
      interval = setInterval(() => {
        if (fireTimer > 0) {
          setFireTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fireTimer]);

  useEffect(() => { // Fire auto-clicker
    if (fire.isLit && monsterAnimationState === 'walking' && !isFighting && isMonsterClickable) {
      const timer = setTimeout(() => {
        handleMonsterClick();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fire.isLit, monsterAnimationState, isFighting, isMonsterClickable]);

  const userHitpointsRef = useRef(userHitpoints);
  useEffect(() => { // Health ref
    userHitpointsRef.current = userHitpoints;
  }, [userHitpoints]);

  useEffect(() => { // Health regeneration
    const healthRegenInterval = setInterval(() => {
      if (!userIsDead && userHitpointsRef.current < maxUserHitpoints) {
        setUserHitpoints(prevHp => Math.min(prevHp + (1 * playerStats.regenerationMultiplier), maxUserHitpoints));
      }
    }, 10000);

    return () => clearInterval(healthRegenInterval);
  }, [userHitpointsRef, maxUserHitpoints, playerStats.regenerationMultiplier]);

  useEffect(() => { // Fire auto-clicker
    if (!fire.isLit || fireTimer <= 0) return;
    if (monsterAnimationState === 'walking' && !isFighting && isMonsterClickable) {
      handleMonsterClick();
    }
  }, [fireTimer]);

  const [pets, setPets] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, { count: 0, kc: [] }]))
  );
  const [killCount, setKillCount] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, 0]))
  );

  useEffect(() => { // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 800);
      if (window.innerWidth >= 800) {
        setOverrideMobile(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [scale, setScale] = useState(1);
  const [alignToTop, setAlignToTop] = useState(false);
  const [overrideMobile, setOverrideMobile] = useState(false);

  const handleOverrideMobileView = () => {
    setOverrideMobile(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width > 800) {
        const widthScale = width / 800;
        const heightScale = height / 350;
        setScale(Math.max(1, Math.min(widthScale, heightScale)));
      } else {
        // Calculate scale for mobile devices
        const mobileWidthScale = 800 / width;
        const mobileHeightScale = 350 / height;
        setScale(Math.max(1, Math.min(mobileWidthScale, mobileHeightScale)));
      }
      setAlignToTop(height < 350);
      setIsDesktop(width >= 800);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial scale

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const purchaseItem = (item) => {
    const itemId = new Date().toISOString();
    if (item === 'Crystal' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Crystal', { name: 'Crystal', rarity: 'Crystal', id: itemId });
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Potion' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      updateCurrency('Potion', 1);
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Logs' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Logs', { name: 'Logs', rarity: 'Logs', id: itemId });
      setPurchaseNotification(true);
      setTimeout(() => setPurchaseNotification(false), 2000);
    } else if (item === 'Tuna' && inventory.Gold >= 1) {
      updateCurrency('Gold', -1);
      addItem('Tuna', { name: 'Tuna', rarity: 'Tuna', id: itemId });
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
    if (showTutorial && tutorialStep === 3) {
      setTutorialStep(4);
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

  const handleWithdraw = (itemKey) => {
    const category = itemKey.split('_')[0];
    withdrawItem(category, itemKey);
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
    attack1Sound.current.volume = 0.5;
    attack2Sound.current.volume = 0.5;
    getPetSound.current.volume = 0.1;
    fireworksSound.current.volume = 0.1;
    deathSound.current.volume = 0.1;
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
    setMonsterHitpoints(monsterTypes[currentMonster].maxHP);
  };

  const handleMonsterDied = () => {
    setIsFighting(false);
    setMonsterHitpoints(0);
    checkForItem();
    checkForPet();
    setTickets((prevTickets) => prevTickets + 10);
    updateCurrency('Gold', 1);
    setKillCount((prevKillCount) => ({
      ...prevKillCount,
      [currentMonster]: prevKillCount[currentMonster] + 1,
    }));
    if (showTutorial && tutorialStep === 1) {
      setTutorialStep(2);
    }

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
    setUserIsDead(true);
    extinguishFire();
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
      playAttackSound(userResult);
      const userDamage = userResult
        ? (1 + Math.floor(calcStats(equipment) / 10) + playerStats.damageBonus) * (potionTimerRef.current > 0 ? 2 : 1)
        : 0;
      setLastAttack({ damage: userDamage, id: Date.now() });
      if (userResult) {
        setMonsterHitpoints((prevHp) => {
          return prevHp - userDamage;
        });
      }

      // Monster attack
      const monsterAdjustedRate = calcMonsterAccuracy(monsterTypes[currentMonster].attack, calcStats(equipment));
      const monsterResult = Math.random() < monsterAdjustedRate;
      if (monsterResult) {
        setDamageFlash(true);
        setTimeout(() => setDamageFlash(false), 200);
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
  }, [isFighting, currentMonster, playerStats.damageBonus]);

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
          zIndex: 1000,
        }}
      >
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>

      { /* Game area */ }
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

        { /* Left panel */ }
        <div style={{ 
          width: '25%', 
          maxWidth: '200px', 
          paddingTop: '10px', 
          position: 'relative', 
          backgroundImage: `url('/coinflip/assets/backgrounds/${inventoryBackground}.png')`,
          backgroundSize: overrideMobile ? 'cover' : 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#111',
        }}>
          <div style={{ 
            position: 'absolute', 
            top: '-16px', 
            left: '0', 
            right: '0', 
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#999',
              margin: '0',
              fontFamily: 'Arial, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Inventory</p>
          </div>
          {renderInventory(inventory, equipItem, usePotion, useCrystal, handleRecycle, recycleMode, handleDrop, scale, lightFire, useTuna, isHighlightingFirstSlot, handleTutorialEquip, isHighlightingPotion)}
          {renderPets(pets, monsterTypes, getColor, hoveredPet, setHoveredPet)}
        </div>

        { /* Center panel */ }
        <div style={{ width: '50%', maxWidth: '400px', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '-16px', 
            left: '0', 
            right: '0', 
            textAlign: 'center'
          }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#999',
                margin: '0',
                fontFamily: 'Arial, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {currentMonster}{' '}
              <span style={{ fontWeight: 'normal', fontSize: '8px' }}>
                (LV {monsterTypes[currentMonster].level})
              </span>
            </p>
          </div>
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
              isHighlighted={showTutorial && tutorialStep === 0}
              tutorialText={getTutorialText()}
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
          {showLevelUpButton && renderLevelUpButton(openSkillTree)}
          {showSkillTree && renderSkillTree(closeSkillTree, handleSelectSkill, playerStats)}
          <div style={{
            position: 'absolute',
            bottom: '23px',
            right: '10px',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: userHitpoints === 0 ? 'black' : 
              damageFlash ? `rgba(150, 0, 0, ${0.5 + 0.5 * (1 - userHitpoints / maxUserHitpoints)})` : 
              `rgb(${150 - (150 * (userHitpoints / maxUserHitpoints))}, ${150 * (userHitpoints / maxUserHitpoints)}, 0)`,
            color: 'white',
            padding: '4px',
            lineHeight: '0.8',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            boxShadow: damageFlash ? '0 0 10px rgba(255, 0, 0, 0.3)' : 'none',
            animation: isLowHP ? 'pulse 1s infinite' : 'none',
          }}>
            {userHitpoints}/{maxUserHitpoints}
          </div>
          {fire.isLit && (
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

        { /* Right panel */ }
        <div style={{
          width: '25%', 
          maxWidth: '200px', 
          paddingTop: '10px', 
          position: 'relative',
          backgroundImage: `url('/coinflip/assets/backgrounds/${equipmentBackground}.png')`,
          backgroundSize: overrideMobile ? 'cover' : 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#111',
        }}>
          <div style={{ 
            position: 'absolute',
            top: '-16px',
            left: '0',
            right: '0',
            textAlign: 'center'
          }}>
            <p style={{ 
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#999',
              margin: '0',
              fontFamily: 'Arial, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Worn Equipment</p>
          </div>
          {renderEquipment(equipment, unequipItem)}
          <StatsInfo 
            equipment={equipment}
            currentMonster={currentMonster}
            monsterTypes={monsterTypes}
            crystalTimer={crystalTimer}
          />
        </div>
      </div>
      {showTutorialCompletion && (
        <TutorialCompletionCertificate onClose={handleCloseTutorialCompletion} />
      )}
    </div>
  );

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const [currentLocation, setCurrentLocation] = useState('game');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (fire.isLit && monsterAnimationState === 'walking' && !isFighting && isMonsterClickable) {
      const timer = setTimeout(() => {
        handleMonsterClick();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fire.isLit, monsterAnimationState, isFighting, isMonsterClickable, handleMonsterClick]);

  useEffect(() => {
    isFightingRef.current = isFighting;
  }, [isFighting]);

  const goToTown = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLocation('town');
      setIsTransitioning(false);
    }, 300);
    setIsFighting(false);
    extinguishFire();
    if (showTutorial) {
      setTutorialStep(5);
    }
  }, []);

  const goToLocation = useCallback((location) => {
    if (showTutorial && location === 'game') {
      handleTutorialComplete();
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLocation(location);
      setIsTransitioning(false);
    }, 300);
  }, [showTutorial, handleTutorialComplete]);

  const renderCurrentLocation = () => {
    const content = (() => {
      switch (currentLocation) {
        case 'town':
          return renderTown(goToLocation, isHighlightingMonster);
        case 'recycler':
          return renderRecycler(inventory, inventoryFull, scrap, handleRecycle, recycleMode, toggleRecycleMode, equipment, equipItem, unequipItem, handleUpgradeSlot);
        case 'shop':
          return renderShop(inventory, inventoryFull, purchaseItem, purchaseNotification);
        case 'bank':
          return renderBank(inventory, bankItems, handleDeposit, handleWithdraw);
        case 'pond':
          return renderPond(showCapybara);
        case 'stats':
          return renderStats(killCount, scores, pets, userDeaths);
        case 'grid':
          return renderGrid();
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
        {((isDesktop || overrideMobile) && showTutorial) && (
          <Tutorial
            step={tutorialStep}
            onComplete={handleTutorialComplete}
            onSkip={handleSkipTutorial}
            positions={getTutorialPositions()}
          />
        )}
        {(isDesktop || overrideMobile) ? renderCurrentLocation() : renderMobileView({
          currentMonster,
          monsterTypes,
          monsterHitpoints,
          handleMonsterClick,
          isMonsterClickable,
          handleMonsterDied,
          spawnNewMonster,
          lastAttack,
          overrideMobileView: handleOverrideMobileView
        })}
        <div
          style={{
            marginTop: '2px',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#b0b0b0',
          }}
        >
          v1.12.4 - <a href='https://alan.computer'
            style={{
              color: '#b0b0b0',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}>alan.computer</a>
            <span 
              onClick={toggleSettings}
              style={{
                marginLeft: '5px',
                cursor: 'pointer',
              }}
            >
              ⚙️
            </span>
        </div>
      </div>
      
      {showSettings && renderSettings(
        inventoryBackground,
        setInventoryBackground,
        equipmentBackground,
        setEquipmentBackground,
        toggleSettings,
      )}
    </div>
  );
};

export default MiniRPG;
