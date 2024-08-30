/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import useInventoryManager from './useInventoryManager';
import InventoryGrid from './components/InventoryGrid'
import MonsterAnimation from './components/MonsterAnimation'
import WornEquipment from './components/WornEquipment'
import Shop from './components/Shop'
import Recycler from './components/Recycler'
import { getColor, getRarityStat } from './utils';
import './styles.css';


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

  const monsterTypes = {
    Goblin: { label: 'Goblin', rate: 1 / 2, maxHP: 4, modifier: 6, rarity: 'Common', experience: 10, ticketCost: 0 },
    Ogre: { label: 'Ogre', rate: 1 / 6, maxHP: 6, modifier: 4, rarity: 'Magic', experience: 50, ticketCost: 1 },
    Demon: { label: 'Demon', rate: 1 / 40, maxHP: 10, modifier: 2, rarity: 'Rare', experience: 100, ticketCost: 2 },
    Dragon: { label: 'Dragon', rate: 1 / 300, maxHP: 34, modifier: 1, rarity: 'Unique', experience: 200, ticketCost: 3 },
  };

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
  const [crystalTimer, setCrystalTimer] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [potionTimer, setPotionTimer] = useState(0);
  const [animationResult, setAnimationResult] = useState(null);
  const [tickets, setTickets] = useState(0);
  const isMonsterClickable = !isFighting && tickets >= monsterTypes[currentMonster].ticketCost;
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [recycleMode, setRecycleMode] = useState(false);

  const experienceToNextLevel = (currentLevel) => Math.floor(100 * Math.pow(1.5, currentLevel - 1));

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
  const petDropRates = Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, 1 / 1000]));
  const [killCount, setKillCount] = useState(
    Object.fromEntries(Object.keys(monsterTypes).map(monster => [monster, 0]))
  );

  useEffect(() => { // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 750);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getItemUrl(name, rarity) {
    if (name === 'crystal' || name === 'potion' || name === 'gold') {
      return new URL(`./assets/items/${name}.png`, import.meta.url).href;
    }
    return new URL(`./assets/items/${name}-${rarity}.png`, import.meta.url)
      .href;
  }

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

  const calculateWinRate = () => {
    const totalStats = calculateTotalStats();
    const statBonus = Math.floor(totalStats / 6) + totalStats * 0.1;
    const baseRate = monsterTypes[currentMonster].rate;
    return Math.min(baseRate * Math.pow(2, statBonus), 1);
  };

  const calculateItemDropRate = () => {
    const baseChance = 0.1;
    const modifier = monsterTypes[currentMonster].modifier;
    return (baseChance * modifier * (crystalTimer > 0 ? 2 : 1) * 100).toFixed(
      2
    );
  };

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
      const expNeeded = experienceToNextLevel(level);
      if (newExp >= expNeeded) {
        setLevel((prevLevel) => prevLevel + 1);
        playLevelUpSound();
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
      const adjustedRate = calculateWinRate();
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

  const renderPets = () =>
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
    );

  const renderLevelAndExperience = () => (
    <div style={{ width: '80%', maxWidth: '800px', marginBottom: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
        Level {level}
      </div>
      <div style={{ width: '100%', backgroundColor: 'rgb(50, 50, 50)', borderRadius: '5px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${(experience / experienceToNextLevel(level)) * 100}%`,
            height: '5px',
            backgroundColor: 'rgb(200, 180, 0)',
            border: '2px solid rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>
      <div style={{ fontSize: '12px', marginTop: '5px' }}>
        {experience} / {experienceToNextLevel(level)} XP
      </div>
    </div>
  );

  const renderGame = () => (
    <div
      style={{
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
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

      {renderLevelAndExperience()}

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
        <div style={{ width: '30%', maxWidth: '200px' }}>
          {renderInventory()}
          {renderShop()}
        </div>
        <div style={{ width: '38%' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {Object.entries(monsterTypes).map(([monster, { label, rarity }]) => (
                <button
                  key={monster}
                  onClick={() => {
                    setCurrentMonster(monster);
                    setMonsterHitpoints(monsterTypes[monster].maxHP);
                  }}
                  style={{
                    backgroundColor: currentMonster === monster ? getColor(rarity) : 'transparent',
                    color: currentMonster === monster ? 'white' : 'black',
                    padding: '0.5em',
                    border: `1px solid ${getColor(rarity)}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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

          <div
            style={{
              margin: '10px',
              textAlign: 'center',
              fontSize: '1.2em',
            }}
          >
            {isFighting
              ? "Fighting..."
              : (isMonsterClickable
                ? `Click the ${currentMonster.toLowerCase()} to fight! (${tickets})`
                : `Not enough tickets. (${tickets})`)
            }
          </div>

          <div
            style={{
              margin: '10px',
              textAlign: 'center',
              fontStyle: 'italic',
              fontSize: '0.8em',
            }}
          >
            Accuracy: {(calculateWinRate() * 100).toFixed(2)}%,
            Drop rate: {calculateItemDropRate()}%
          </div>

          {
            (crystalTimer > 0 || potionTimer > 0) && (
              <div
                style={{
                  marginBottom: '10px',
                  textAlign: 'center',
                  padding: '10px',
                  backgroundColor: '#80d3da',
                  borderRadius: '5px',
                  width: 'fit-content',
                  margin: '0 auto',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                {crystalTimer > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <img
                      src={getItemUrl('crystal', 'Crystal')}
                      alt="Crystal"
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span>
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
                    <span>
                      {Math.floor(potionTimer / 60)}:
                      {(potionTimer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            )
          }

          <div style={{ marginBottom: '30px' }}>
            <h3>Recently Obtained Items:</h3>
            {recentItems.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {recentItems.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      color: `${getColor(item.rarity)}`,
                      textShadow: '1px 1px #000',
                      borderRadius: '4px',
                      textDecoration: item.missed ? 'line-through' : 'none',
                    }}
                  >
                    {item.count ? `${item.count} ` : ''}
                    {item.rarity ? `${item.rarity} ` : ''}
                    {item.name}
                    {item.count > 1 ? 's' : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items obtained yet.</p>
            )}
          </div>

          {renderPets()}

          <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
            <p>Notice: Any resemblance to actual games is purely coincidental.</p>
          </div>

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#666',
            }}
          >
            Version 1.7.0 - <a href='https://alan.computer'>alan.computer</a>
          </div>
        </div>
        <div style={{ width: '30%', maxWidth: '200px' }}>
          {renderEquipment()}
          {renderRecycler()}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
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

  const renderShop = () => (
    <div style={{ marginTop: '20px' }}>
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

  const renderEquipment = () => {
    const hasFullUniqueSet = Object.values(equipment).every(
      (item) => item && item.rarity === 'Unique'
    );
    return (
      <div
        style={{
          backgroundColor: hasFullUniqueSet ? '#444' : 'transparent',
        }}
      >
        <WornEquipment
          equipment={equipment}
          onUnequip={unequipItem}
          fullUnique={hasFullUniqueSet}
        />
      </div>
    );
  };

  const renderRecycler = () => (
    <div>
      <Recycler
        inventory={inventory}
        inventoryFull={inventoryFull}
        scrap={scrap}
        onRecycle={handleRecycle}
        onExchange={handleExchange}
        recycleMode={recycleMode}
        toggleRecycleMode={toggleRecycleMode}
      />
    </div>
  );

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const renderMobileView = () => (
    <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#f0f0f0' }}>
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
      <p style={{ marginTop: '20px', fontSize: '16px' }}>
        Support for small screens coming soon™
      </p>
    </div>
  );

  return (
    <div
      style={{
        width: isDesktop ? '100%' : '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      {isDesktop ? (
        renderGame()
      ) : (
        renderMobileView()
      )}
    </div>
  );
};

export default MiniRPG;
