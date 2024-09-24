import React, { useState, useEffect, useRef } from 'react';
import { ATTACK_SPEED, MIN_HEIGHT_VIEW } from '../constants/gameData';
import { getBackgroundImage } from '../utils';

const BattleScreen = ({
  monster,
  hitpoints,
  maxHP,
  onMonsterClick,
  isClickable,
  handleMonsterDied,
  spawnNewMonster,
  experienceGained,
  lastAttack,
  isFighting,
  onAnimationStateChange,
  onBattleEnd
}) => {
  const [animationState, setAnimationState] = useState('idle');
  const [showExperience, setShowExperience] = useState(false);
  const monsterRef = useRef(null);
  const [hitsplats, setHitsplats] = useState([]);

  const sizeByMonster = {
    'Goblin': '100px',
    'Ogre': '150px',
    'Demon': '220px',
    'Dragon': '250px',
  };

  useEffect(() => {
    if (hitpoints <= 0 && animationState !== 'dying') {
      setAnimationState('dying');
      onAnimationStateChange('dying');
    }
  }, [hitpoints, animationState, onAnimationStateChange]);

  useEffect(() => {
    if (lastAttack.id !== null) {
      addHitsplat(lastAttack.damage);
    }
  }, [lastAttack]);

  const startDyingAnimation = () => {
    handleMonsterDied();
    const DEATH_DURATION = 2000;

    setShowExperience(true);
    setTimeout(() => {
      setShowExperience(false);
      onBattleEnd();
    }, DEATH_DURATION);
  };

  const addHitsplat = (damage) => {
    const newHitsplat = {
      id: Date.now() + Math.random(),
      damage,
      position: {
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
      },
      isMiss: damage === 0,
    };
    setHitsplats(prev => [...prev, newHitsplat]);
    setTimeout(() => {
      setHitsplats(prev => prev.filter(h => h.id !== newHitsplat.id));
    }, 1000);
  };

  const handleClick = () => {
    if (isClickable) {
      setAnimationState('attacking');
      onMonsterClick();
      setTimeout(() => setAnimationState('idle'), ATTACK_SPEED);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: MIN_HEIGHT_VIEW,
      backgroundColor: '#f0f0f0',
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      backgroundImage: `url(/coinflip/assets/backgrounds/${getBackgroundImage(monster)})`,
    }}>
      {/* Player */}
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'red',

        }}
      />

      {/* Monster */}
      <div
        ref={monsterRef}
        style={{
          width: sizeByMonster[monster],
          height: sizeByMonster[monster],
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          cursor: isClickable ? 'pointer' : 'default',
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
          src={`/coinflip/assets/monsters/${monster.toLowerCase()}.png`}
          alt={monster}
          style={{
            height: '100%',
            userSelect: 'none',
            animation: animationState === 'attacking' ? 'monsterAttack 0.5s' : 'none',
          }}
          draggable='false'
        />
        {showExperience && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'monospace',
              color: '#f0f0f0',
              animation: 'floatUp 3s forwards',
            }}
          >
            +{experienceGained} XP
          </div>
        )}
        {hitsplats.map(hitsplat => (
          <div
            key={hitsplat.id}
            style={{
              position: 'absolute',
              left: `${hitsplat.position.left}%`,
              top: `${hitsplat.position.top}%`,
              backgroundColor: hitsplat.isMiss ? 'blue' : 'red',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '50%',
              fontSize: '14px',
              fontWeight: 'bold',
              animation: 'fadeOutUp 1s forwards',
            }}
          >
            {hitsplat.damage}
          </div>
        ))}
      </div>

      {/* Flee Button */}
      <button
        onClick={onBattleEnd}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          padding: '5px',
          fontSize: '1em',
          lineHeight: '1em',
          backgroundColor: '#f0f0f0',
          color: '#000',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        ⬅️ Retreat
      </button>
    </div>
  );
};

export default BattleScreen;