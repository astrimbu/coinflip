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
import { monsterTypes, petDropRates, FIRE_LENGTH, ATTACK_SPEED, TREE_LIMITS, MONSTER_ATTACK_OFFSET } from './constants/gameData';
import { TUTORIAL_STEPS } from './constants/tutorialData';
import './styles.css';
import {
  getColor,
  getRarityStat,
  getItemUrl,
  xpToNextLevel,
  calcMonsterAccuracy,
  calcStats,
  calcAccuracy,
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
  renderDeathScreen,
  renderStats,
  renderSettings,
  renderGrid,
} from './renderFunctions';
import Tree from './components/Tree';
import Toast from './components/Toast';
import HealthBar from './components/HealthBar';


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
  const [treeAvailable, setTreeAvailable] = useState(false);
  const [showTree, setShowTree] = useState(false);
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
  const [inventoryBackground, setInventoryBackground] = useState('i');
  const [equipmentBackground, setEquipmentBackground] = useState('e');
  const [showCapybara, setShowCapybara] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    damageBonus: 0,
    experienceBonus: 0,
    goldMultiplier: 1,
    autoUnlocked: false,
    treePoints: 0,
    treeInvestments: {
      auto: 0,
      damage: 0,
      experience: 0,
      lifesteal: 0,
      goldBonus: 0,
      stats: 0
    }
  });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const currentTutorialStep = TUTORIAL_STEPS[tutorialStep];
  const isHighlightingFirstSlot = showTutorial && currentTutorialStep?.highlight?.type === 'inventory_slot';
  const isHighlightingPotion = showTutorial && currentTutorialStep?.highlight?.type === 'potion';
  const isHighlightingMonster = showTutorial && currentTutorialStep?.highlight?.type === 'monster_icon';
  const [showTutorialCompletion, setShowTutorialCompletion] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [showSetCompletion, setShowSetCompletion] = useState(false);
  const [hasShownSetNotification, setHasShownSetNotification] = useState(false);

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

  const handleSelectNode = (node) => {
    if (playerStats.treePoints <= 0) return;

    setPlayerStats(prevStats => {
      // Check if node is already maxed based on investment count
      if (prevStats.treeInvestments[node] >= TREE_LIMITS[node]) {
        return prevStats;
      }

      const newStats = { 
        ...prevStats, 
        treePoints: prevStats.treePoints - 1,
        treeInvestments: {
          ...prevStats.treeInvestments,
          [node]: prevStats.treeInvestments[node] + 1
        }
      };
      
      // Apply the effects based on the node
      switch(node) {
        case 'auto':
          newStats.autoUnlocked = true;
          break;
        case 'damage':
          newStats.damageBonus = prevStats.damageBonus + 1;
          break;
        case 'experience':
          newStats.experienceBonus = prevStats.experienceBonus + 10;
          break;
        case 'lifesteal':
          newStats.lifestealPercent = (prevStats.lifestealPercent || 0) + 50;
          break;
        case 'goldBonus':
          newStats.goldMultiplier = prevStats.goldMultiplier * 2;
          break;
        case 'stats':
          newStats.statsBonus = (prevStats.statsBonus || 0) + 1;
          break;
      }
      
      return newStats;
    });
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

  useEffect(() => { // Auto-attack
    if ((fire.isLit || (playerStats.autoUnlocked && autoMode)) && 
        monsterAnimationState === 'walking' && 
        !isFighting && 
        isMonsterClickable) {
      const timer = setTimeout(() => {
        handleMonsterClick();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fire.isLit, autoMode, playerStats.autoUnlocked, monsterAnimationState, isFighting, isMonsterClickable, handleMonsterClick]);

  const userHitpointsRef = useRef(userHitpoints);
  useEffect(() => { // Health ref
    userHitpointsRef.current = userHitpoints;
  }, [userHitpoints]);

  useEffect(() => { // Health regeneration
    const healthRegenInterval = setInterval(() => {
      if (!userIsDead && userHitpointsRef.current < maxUserHitpoints) {
        setUserHitpoints(prevHp => Math.min(prevHp + 1, maxUserHitpoints));
      }
    }, 10000);

    return () => clearInterval(healthRegenInterval);
  }, [userHitpointsRef, maxUserHitpoints]);

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
    attack1Sound.current.volume = 0.05;
    attack2Sound.current.volume = 0.05;
    getPetSound.current.volume = 0.05;
    fireworksSound.current.volume = 0.01;
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

  const handleMonsterRespawn = () => {
    setMonsterHitpoints(monsterTypes[currentMonster].maxHP);
  };

  const handleMonsterDied = () => {
    // Stop combat immediately
    setIsFighting(false);
    setMonsterHitpoints(0);
    
    // Handle rewards/stats
    checkForItem();
    checkForPet();
    
    // Apply gold multiplier
    const baseGold = 1;
    const goldGained = Math.floor(baseGold * playerStats.goldMultiplier);
    setTickets((prevTickets) => prevTickets + 10);
    updateCurrency('Gold', goldGained);
    
    setKillCount((prevKillCount) => ({
      ...prevKillCount,
      [currentMonster]: prevKillCount[currentMonster] + 1,
    }));

    // Apply experience bonus
    const baseExp = monsterTypes[currentMonster].experience;
    const expMultiplier = 1 + (playerStats.experienceBonus / 100);
    const expGained = Math.floor(baseExp * expMultiplier);
    
    setExperience((prevExp) => {
      const newExp = prevExp + expGained;
      const expNeeded = xpToNextLevel(level);
      if (newExp >= expNeeded) {
        handleLevelUp();
        return newExp - expNeeded;
      }
      return newExp;
    });

    if (showTutorial && ['fighting', 'attack_monster'].includes(TUTORIAL_STEPS[tutorialStep]?.id)) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const handleUserDied = () => {
    setIsFighting(false);
    setUserIsDead(true);
    extinguishFire();
    setUserDeaths(prev => prev + 1);
    setAutoMode(false);
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
      const userStats = calcStats(equipment, playerStats);
      const accuracy = calcAccuracy(userStats, monsterTypes[currentMonster]);
      
      // Player attacks first
      if (Math.random() < accuracy) {
        const damage = (Math.max(1, Math.floor(userStats / 3)) + (playerStats.damageBonus || 0)) * (potionTimer > 0 ? 2 : 1);
        setMonsterHitpoints(prev => Math.max(0, prev - damage));
        
        // Apply lifesteal if the player has it
        if (playerStats.lifestealPercent > 0) {
          const healAmount = Math.floor((damage * playerStats.lifestealPercent) / 100);
          setUserHitpoints(prev => Math.min(maxUserHitpoints, prev + healAmount));
        }
        
        playAttackSound(true);
        setLastAttack({
          id: Date.now(),
          damage: damage
        });
      } else {
        playAttackSound(false);
        setLastAttack({
          id: Date.now(),
          damage: 0
        });
      }

      // Monster attacks after 600ms (half of ATTACK_SPEED)
      setTimeout(() => {
        if (!isFightingRef.current) return; // Check if still fighting
        
        if (Math.random() < calcMonsterAccuracy(monsterTypes[currentMonster], userStats)) {
          const monsterDamage = monsterTypes[currentMonster].damage;
          setUserHitpoints(prev => {
            const newHp = Math.max(0, prev - monsterDamage);
            if (newHp === 0) {
              handleUserDied();
            }
            return newHp;
          });
          setDamageFlash(true);
          setTimeout(() => setDamageFlash(false), 200);
        }
      }, MONSTER_ATTACK_OFFSET);
    };

    if (isFighting) {
      performAttack();
      fightIntervalRef.current = setInterval(performAttack, ATTACK_SPEED);
    } else {
      clearInterval(fightIntervalRef.current);
    }

    return () => clearInterval(fightIntervalRef.current);
  }, [isFighting, currentMonster, equipment, playerStats.damageBonus]);

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
    setLevel(prevLevel => {
      const newLevel = prevLevel + 1;
      setExperience(0);
      setMaxUserHitpoints(10 + newLevel * 2);
      setUserHitpoints(10 + newLevel * 2);
      setPlayerStats(prevStats => ({
        ...prevStats,
        treePoints: prevStats.treePoints + 1
      }));
      setTreeAvailable(true);
      playLevelUpSound();
      return newLevel;
    });
  };

  const openTree = () => {
    setShowTree(true);
    setTreeAvailable(false);
  };

  const closeTree = () => {
    setShowTree(false);
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
              fontFamily: 'monospace',
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
                fontFamily: 'monospace',
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
              handleMonsterRespawn={handleMonsterRespawn}
              experienceGained={Math.floor(monsterTypes[currentMonster].experience * (1 + playerStats.experienceBonus / 100))}
              lastAttack={lastAttack}
              isFighting={isFighting}
              onAnimationStateChange={handleAnimationStateChange}
              isHighlighted={showTutorial && currentTutorialStep?.highlight?.type === 'monster'}
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
          {renderLevelAndExperience(
            level,
            experience,
            xpToNextLevel,
            playerStats.autoUnlocked,
            autoMode,
            () => setAutoMode(prev => !prev)
          )}
          {showTree && <Tree 
            onClose={closeTree} 
            onSelectNode={handleSelectNode} 
            playerStats={playerStats}
          />}
          <HealthBar 
            current={userHitpoints}
            max={maxUserHitpoints}
            isFlashing={damageFlash}
            isLowHP={isLowHP}
          />
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
          paddingTop: '20px', 
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
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Equipment</p>
          </div>
          {renderEquipment(equipment, unequipItem)}
          <StatsInfo 
            equipment={equipment}
            currentMonster={currentMonster}
            monsterTypes={monsterTypes}
            crystalTimer={crystalTimer}
            playerStats={playerStats}
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
    setAutoMode(false);
    setMonsterHitpoints(monsterTypes[currentMonster].maxHP);
    setMonsterAnimationState('walking');
    if (showTutorial && TUTORIAL_STEPS[tutorialStep]?.id === 'go_town') {
      setTutorialStep(tutorialStep + 1);
    }
  }, [showTutorial, tutorialStep, currentMonster, monsterTypes]);

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
        {showTree && <Tree 
          onClose={closeTree} 
          onSelectNode={handleSelectNode} 
          playerStats={playerStats}
        />}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '10px',
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
          <button
            onClick={openTree}
            style={{
              padding: '10px',
              fontSize: '24px',
              backgroundColor: playerStats.treePoints > 0 ? '#c8b400' : '#C0C0C0',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🌳
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showTree) {
        closeTree();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showTree]);

  const checkFullCommonSet = useCallback(() => {
    if (hasShownSetNotification) return;
    
    const requiredSlots = ['Hat', 'Cape', 'Amulet', 'Weapon', 'Body', 'Pants', 'Gloves', 'Boots', 'Ring'];
    const hasFullCommonSet = requiredSlots.every(slot => 
      equipment[slot] && equipment[slot].rarity === 'Common'
    );

    if (hasFullCommonSet) {
      setShowSetCompletion(true);
      setHasShownSetNotification(true);
      setTimeout(() => setShowSetCompletion(false), 5000);
    }
  }, [equipment, hasShownSetNotification]);

  useEffect(() => {
    checkFullCommonSet();
  }, [equipment, checkFullCommonSet]);

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
            positions={currentTutorialStep.position}
          />
        )}
        {(isDesktop || overrideMobile) ? renderCurrentLocation() : renderMobileView({
          currentMonster,
          monsterTypes,
          monsterHitpoints,
          handleMonsterClick,
          isMonsterClickable,
          handleMonsterDied,
          handleMonsterRespawn,
          lastAttack,
          overrideMobileView: handleOverrideMobileView,
          onAnimationStateChange: handleAnimationStateChange,
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
          <span 
            onClick={toggleSettings}
            style={{
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            ⚙️ -
          </span>
          v1.13.11 - <a href='https://alan.computer'
            style={{
              color: '#b0b0b0',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}>alan.computer</a>
        </div>
      </div>
      
      {showSettings && renderSettings(
        inventoryBackground,
        setInventoryBackground,
        equipmentBackground,
        setEquipmentBackground,
        toggleSettings,
      )}
      {showSetCompletion && (
        <Toast
          message="Achievement: Full Common Set Equipped"
          onClose={() => setShowSetCompletion(false)}
        />
      )}
    </div>
  );
};

export default MiniRPG;
