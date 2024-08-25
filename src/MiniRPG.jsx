/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import useInventoryManager from './useInventoryManager';
import InventoryGrid from './components/InventoryGrid'
import WornEquipment from './components/WornEquipment'
import Shop from './components/Shop'
import Recycler from './components/Recycler'
import './hover.css';

const MonsterAnimation = ({
  monster,
  hitpoints,
  maxHP,
  onMonsterClick,
  isClickable,
  handleMonsterDied,
  spawnNewMonster,
}) => {
  const [animationState, setAnimationState] = useState('walking');
  const [fightPosition, setFightPosition] = useState(null);
  const monsterRef = useRef(null);
  const walkAnimationRef = useRef(null);
  const fightAnimationRef = useRef(null);
  const currentPositionRef = useRef(0);
  const facingRightRef = useRef(true);

  const sizeByMonster = {
    'Goblin': '100px',
    'Ogre': '150px',
    'Demon': '220px',
    'Dragon': '250px',
  };

  useEffect(() => {
    if (animationState === 'walking') {
      startWalkingAnimation();
    } else if (animationState === 'fighting') {
      setFightPosition(currentPositionRef.current);
      stopWalkingAnimation();
      startFightingAnimation();
    } else if (animationState === 'dying') {
      stopAllAnimations();
      startDyingAnimation();
    }

    return () => {
      stopAllAnimations();
    };
  }, [animationState]);

  useEffect(() => {
    if (hitpoints <= 0 && animationState !== 'dying' && animationState !== 'dead') {
      setAnimationState('dying');
    } else if (hitpoints > 0 && animationState === 'dead') {
      setAnimationState('walking');
    }
  }, [hitpoints]);

  const startWalkingAnimation = () => {
    const startPosition = 0;
    currentPositionRef.current = startPosition;

    walkAnimationRef.current = monsterRef.current.animate(
      [
        { transform: `translateX(${startPosition}px)` },
        { transform: `translateX(${startPosition - 100}px)` },
        { transform: `translateX(${startPosition}px)` },
        { transform: `translateX(${startPosition + 100}px)` },
        { transform: `translateX(${startPosition}px)` },
      ],
      {
        duration: 10000,
        easing: 'linear',
        iterations: Infinity,
      }
    );

    const updatePosition = () => {
      if (walkAnimationRef.current && animationState === 'walking') {
        const progress = walkAnimationRef.current.currentTime % 10000 / 10000;
        let newPosition;
        if (progress < 0.25) {
          facingRightRef.current = false;
          newPosition = startPosition - 400 * progress;
        } else if (progress < 0.75) {
          facingRightRef.current = true;
          newPosition = startPosition - 100 + 400 * (progress - 0.25);
        } else {
          facingRightRef.current = false;
          newPosition = startPosition + 100 - 400 * (progress - 0.75);
        }
        currentPositionRef.current = newPosition;
        const img = monsterRef.current.children[1];
        img.style.transform = `scaleX(${facingRightRef.current ? -1 : 1})`;
        requestAnimationFrame(updatePosition);
      }
    };
    requestAnimationFrame(updatePosition);
  };

  const stopWalkingAnimation = () => {
    if (walkAnimationRef.current) {
      walkAnimationRef.current.pause();
    }
  };

  const startFightingAnimation = () => {
    const fp = currentPositionRef.current;
    const fightAnimation = () => {
      if (animationState === 'fighting') {
        fightAnimationRef.current = monsterRef.current.animate(
          [
            { transform: `translateX(${fp}px) rotate(0deg)` },
            { transform: `translateX(${fp - 5}px) rotate(-5deg)`, offset: 0.1 },
            { transform: `translateX(${fp}px) rotate(0deg)`, offset: 0.2 },
            { transform: `translateX(${fp + 5}px) rotate(5deg)`, offset: 0.3 },
            { transform: `translateX(${fp}px) rotate(0deg)`, offset: 0.4 },
            { transform: `translateX(${fp}px) rotate(0deg)` },
          ],
          {
            duration: 600,
            easing: 'ease-out',
          }
        );
        fightAnimationRef.current.onfinish = () => {
          if (animationState === 'fighting') {
            requestAnimationFrame(fightAnimation);
          }
        };
      }
    };
    fightAnimation();
  };

  const stopFightingAnimation = () => {
    if (fightAnimationRef.current) {
      fightAnimationRef.current.cancel();
    }
  };

  const startDyingAnimation = () => {
    handleMonsterDied();
    const img = monsterRef.current.children[1];
    const healthBar = monsterRef.current.children[0].children[0];

    // Set health bar to 0 immediately
    healthBar.style.width = '0%';
    // healthBar.style.backgroundColor = 'red';

    const dyingAnimation = img.animate(
      [
        { transform: `scaleX(${facingRightRef.current ? -1 : 1}) rotate(0deg)`, opacity: 1 },
        { transform: `scaleX(${facingRightRef.current ? -1 : 1}) rotate(90deg)`, opacity: 1, offset: 0.1 },
        { transform: `scaleX(${facingRightRef.current ? -1 : 1}) rotate(90deg)`, opacity: 1, offset: 0.8 },
        { transform: `scaleX(${facingRightRef.current ? -1 : 1}) rotate(90deg)`, opacity: 0, offset: 0.80001 },
        { transform: `scaleX(1) rotate(0deg)`, opacity: 0, offset: 0.999999999 },
        { transform: `scaleX(1) rotate(0deg)`, opacity: 1 },
      ],
      {
        duration: 5000,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );
    dyingAnimation.onfinish = () => {
      setAnimationState('dead');
      respawnMonster();
    };
  };

  const stopAllAnimations = () => {
    stopWalkingAnimation();
    stopFightingAnimation();
  };

  const respawnMonster = () => {
    stopAllAnimations();
    const div = monsterRef.current;
    div.style.opacity = '1';
    const img = monsterRef.current.children[1];
    img.style.opacity = '1';
    img.style.transform = 'scaleX(1) rotate(0deg)';
    currentPositionRef.current = 0;
    facingRightRef.current = true;
    setAnimationState('walking');
    spawnNewMonster();
  };

  const handleClick = () => {
    if (isClickable && animationState === 'walking') {
      setAnimationState('fighting');
      onMonsterClick();
    }
  };

  return (
    <div
      ref={monsterRef}
      style={{
        width: sizeByMonster[monster],
        height: sizeByMonster[monster],
        margin: '20px auto',
        marginBottom: '45px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: isClickable && animationState === 'walking' ? 'pointer' : 'default',
        gap: '20px',
      }}
      onClick={handleClick}
    >
      <div style={{ width: '50px', height: '8px', backgroundColor: 'red', }}>
        <div
          style={{
            width: `${(hitpoints / maxHP) * 100}%`,
            height: '8px',
            backgroundColor: 'green',
            transition: 'width 0.3s ease-out',
          }}
        />
      </div>
      <img
        src={new URL(`./assets/monsters/${monster.toLowerCase()}.png`, import.meta.url).href}
        alt={monster}
        style={{
          height: '100%',
        }}
      />
    </div>
  );
};

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

  const maxHP = {
    easy: 4,
    medium: 6,
    hard: 10,
    impossible: 16,
  };
  const difficultyLevels = {
    easy: { label: 'Easy', rate: 1 / 2, color: '#4CAF50', monster: 'Goblin' },
    medium: { label: 'Medium', rate: 1 / 6, color: '#3B88FF', monster: 'Ogre' },
    hard: { label: 'Hard', rate: 1 / 40, color: '#F44336', monster: 'Demon' },
    impossible: { label: 'Impossible', rate: 1 / 300, color: '#000', monster: 'Dragon' },
  };
  const difficultyModifiers = { easy: 6, medium: 4, hard: 2, impossible: 1 };
  const rarityByDifficulty = {
    easy: 'Common',
    medium: 'Magic',
    hard: 'Rare',
    impossible: 'Unique',
  };
  const [difficulty, setDifficulty] = useState('easy');
  const [, setScores] = useState({
    easy: { fights: 0, wins: 0 },
    medium: { fights: 0, wins: 0 },
    hard: { fights: 0, wins: 0 },
    impossible: { fights: 0, wins: 0 },
  });
  const [checkSeed, setCheckSeed] = useState(Math.random());
  const [itemSeed, setItemSeed] = useState(Math.random());
  const [result, setResult] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const fightIntervalRef = useRef(null);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDying, setIsDying] = useState(false);
  const [monsterHitpoints, setMonsterHitpoints] = useState(maxHP[difficulty]);
  const [view, setView] = useState('game');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1200);
  const [crystalTimer, setCrystalTimer] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState(false);
  const [potionTimer, setPotionTimer] = useState(0);
  const [, setAnimationResult] = useState(null);
  const [tickets, setTickets] = useState(0);
  const ticketCost = { easy: 0, medium: 1, hard: 2, impossible: 3 };
  const isMonsterClickable = !isFighting && tickets >= ticketCost[difficulty];

  const handleMonsterClick = () => {
    if (isMonsterClickable) {
      fightMonster();
      setItemSeed(Math.random());
      setCheckSeed(Math.random());
    }
  };

  const [pets, setPets] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    impossible: 0,
  });
  const petDropRates = {
    easy: 1 / 1000,
    medium: 1 / 1000,
    hard: 1 / 1000,
    impossible: 1 / 1000,
  };

  useEffect(() => { // Resize listener
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common':
        return '#4CAF50';
      case 'Magic':
        return '#3B88FF';
      case 'Rare':
        return '#F44336';
      case 'Unique':
        return '#000';
      default:
        return '#ccc';
    }
  };
  const getRarityStat = (rarity) => {
    switch (rarity) {
      case 'Common':
        return 1;
      case 'Magic':
        return 2;
      case 'Rare':
        return 3;
      case 'Unique':
        return 5;
      default:
        return 0;
    }
  };
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
    const baseRate = difficultyLevels[difficulty].rate;
    return Math.min(baseRate * Math.pow(2, statBonus), 1);
  };

  const calculateItemDropRate = () => {
    const baseChance = 0.1;
    const modifier = difficultyModifiers[difficulty];
    return (baseChance * modifier * (crystalTimer > 0 ? 2 : 1) * 100).toFixed(
      2
    );
  };

  const handleRecycle = (items) => {
    recycleItems(items);
  };

  const handleExchange = (rarity, itemName) => {
    removeScrap(rarity);
    addItem(itemName, { name: itemName, rarity, stat: getRarityStat(rarity) });
  };

  const checkForPet = () => {
    const dropRate = petDropRates[difficulty];
    if (checkSeed < dropRate) {
      setPets((prevPets) => ({
        ...prevPets,
        [difficulty]: prevPets[difficulty] + 1,
      }));
    }
  };

  const checkForItem = () => {
    const baseChance = 0.1;
    const modifier = difficultyModifiers[difficulty];
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
      const rarity = rarityByDifficulty[difficulty];

      let newItem;
      const extraItems = {
        easy: 1,
        medium: 2,
        hard: 3,
        impossible: 4,
      }[difficulty];

      if (randomItem === 'Gold' || randomItem === 'Potion') {
        updateCurrency(randomItem, extraItems);
        newItem = { name: randomItem, count: extraItems };
      } else {
        const stat = getRarityStat(rarity);
        newItem = { name: randomItem, rarity, stat };
        addItem(randomItem, newItem);
        //  newItem.missed = true;
      }
    }
  };

  const fightMonster = () => {
    const ticketCost = { easy: 0, medium: 1, hard: 2, impossible: 3 }[difficulty];
    if (tickets < ticketCost) {
      return;
    }
    setTickets((prevTickets) => prevTickets - ticketCost);
    setIsFighting(true);
  };

  const spawnNewMonster = () => {
    setIsDying(false);
    setMonsterHitpoints(maxHP[difficulty]);
  };

  const handleMonsterDied = () => {
    setIsFighting(false);
    setIsAttacking(false);
    setMonsterHitpoints(0);
    checkForItem();
    checkForPet();
    setTickets((prevTickets) => prevTickets + 10);
    spawnNewMonster();
  };

  useEffect(() => { // Fight Monster effect
    const performAttack = () => {
      const adjustedRate = calculateWinRate();
      const result = Math.random() < adjustedRate;
      setResult(result);

      setIsAttacking(true);

      if (result) {
        const damage = potionTimer > 0 ? 2 : 1;
        setMonsterHitpoints((prevHp) => {
          const newHp = prevHp - damage;
          if (newHp <= 0) {
            // TODO: Make room for death animation
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
          [difficulty]: {
            fights: prevScores[difficulty].fights + 1,
            wins: prevScores[difficulty].wins + (result ? 1 : 0),
          },
        }));

      }, 300);
    };

    if (isFighting) {
      performAttack();
      fightIntervalRef.current = setInterval(performAttack, 600);
    } else {
      clearInterval(fightIntervalRef.current);
    }

    return () => clearInterval(fightIntervalRef.current);
  }, [isFighting, difficulty]);

  const renderPets = () =>
    (pets.easy > 0 ||
      pets.medium > 0 ||
      pets.hard > 0 ||
      pets.impossible > 0) && (
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
            .filter(([, count]) => count > 0)
            .map(([key, count]) => (
              <div key={key} style={{ textAlign: 'center', margin: '0 auto' }}>
                <img
                  src={`${getItemUrl('pet', key)}`}
                  alt={`${difficultyLevels[key].label} Pet`}
                  style={{}}
                />
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: `${difficultyLevels[key].color}`,
                  }}
                >
                  x{count}
                </div>
              </div>
            ))}
        </div>
        <span style={{ fontSize: '10px' }}>(1/1,000)</span>
      </div>
    );

  const renderGame = () => (
    <div
      style={{
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <h1
        style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}
      >
        Mini RPG
      </h1>

      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {Object.entries(difficultyLevels).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => {
                setDifficulty(key);
                setMonsterHitpoints(maxHP[key]);
              }}
              style={{
                backgroundColor: difficulty === key ? color : 'transparent',
                color: difficulty === key ? 'white' : 'black',
                padding: '0.5em',
                border: `1px solid ${color}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <MonsterAnimation
        monster={difficultyLevels[difficulty].monster}
        hitpoints={monsterHitpoints}
        maxHP={maxHP[difficulty]}
        onMonsterClick={handleMonsterClick}
        isClickable={isMonsterClickable}
        handleMonsterDied={handleMonsterDied}
        spawnNewMonster={spawnNewMonster}
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
            ? `Click the ${difficultyLevels[difficulty].monster.toLowerCase()} to fight! (${tickets})`
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
            }}
          >
            {crystalTimer > 0 && (
              <div>
                Crystal ({Math.floor(crystalTimer / 60)}:
                {(crystalTimer % 60).toString().padStart(2, '0')})
              </div>
            )}
            {potionTimer > 0 && (
              <div>
                Potion ({Math.floor(potionTimer / 60)}:
                {(potionTimer % 60).toString().padStart(2, '0')})
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
                  color: `${getRarityColor(item.rarity)}`,
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
        Version 1.5.5 - <a href='https://alan.computer'>alan.computer</a>
      </div>
    </div >
  );

  const renderInventory = () => (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <h3>Inventory</h3>
      <InventoryGrid
        items={inventory}
        onEquip={equipItem}
        onUsePotion={usePotion}
        onUseCrystal={useCrystal}
      />
    </div>
  );

  const renderEquipment = () => {
    const hasFullUniqueSet = Object.values(equipment).every(
      (item) => item && item.rarity === 'Unique'
    );
    return (
      <div
        style={{
          backgroundColor: hasFullUniqueSet ? '#444' : '#f0f0f0',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h3>Equipment</h3>
        <WornEquipment
          equipment={equipment}
          onUnequip={unequipItem}
          fullUnique={hasFullUniqueSet}
        />
      </div>
    );
  };

  const renderCharacter = () => (
    <div
      style={{
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
      }}
    >
      <div style={{ width: '55%' }}>
        <h3>Inventory</h3>
        <InventoryGrid
          items={inventory}
          onEquip={equipItem}
          onUsePotion={usePotion}
        />
      </div>
      <div style={{ width: '45%', backgroundColor: '#ccc' }}>
        <h3>Equipment</h3>
        <WornEquipment equipment={equipment} onUnequip={unequipItem} />
      </div>
    </div>
  );

  const renderShop = () => (
    <>
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
    </>
  );

  const renderRecycler = () => (
    <Recycler
      inventory={inventory}
      inventoryFull={inventoryFull}
      scrap={scrap}
      onRecycle={handleRecycle}
      onExchange={handleExchange}
    />
  );

  return (
    <div
      style={{
        width: isDesktop ? '100%' : '420px',
        margin: '0 auto',
        display: isDesktop ? 'flex' : 'block',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      {!isDesktop && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => setView('game')}
            style={{ marginRight: '10px' }}
          >
            Game
          </button>
          <button
            onClick={() => setView('character')}
            style={{ marginRight: '10px' }}
          >
            Character
          </button>
          <button
            onClick={() => setView('recycler')}
            style={{ marginRight: '10px' }}
          >
            Recycler
          </button>
          <button onClick={() => setView('shop')}>Shop</button>
        </div>
      )}

      {isDesktop ? (
        <>
          <div style={{ width: '25%' }}>
            {renderInventory()}
            {renderShop()}
          </div>
          <div style={{ width: '50%' }}>{renderGame()}</div>
          <div style={{ width: '25%' }}>
            {renderEquipment()}
            {renderRecycler()}
          </div>
        </>
      ) : (
        <>
          {view === 'game' && renderGame()}
          {view === 'character' && renderCharacter()}
          {view === 'shop' && renderShop()}
          {view === 'recycler' && renderRecycler()}
        </>
      )}

    </div>
  );
};

export default MiniRPG;
