/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';

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

        if (facingRightRef.current) {
          img.style.animation = 'flipRight 0.1s forwards';
        } else {
          img.style.animation = 'flipLeft 0.1s forwards';
        }

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
    const healthBar = monsterRef.current.children[0];
    const health = monsterRef.current.children[0].children[0];
    const DEATH_DURATION = 2000;

    const dyingAnimation = img.animate(
      [
        { transform: `rotate(0deg)`, opacity: 1 },
        { transform: `rotate(90deg)`, opacity: 1, offset: 0.3 },
        { transform: `rotate(90deg)`, opacity: 1, offset: 0.8 },
        { transform: `rotate(90deg)`, opacity: 0, offset: 0.9 },
        { transform: `rotate(0deg)`, opacity: 0, offset: 0.9999 },
      ],
      {
        duration: DEATH_DURATION,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );
    dyingAnimation.onfinish = () => {
      setAnimationState('dead');
      respawnMonster();
    };

    const healthBarAnimation = healthBar.animate(
      [
        { opacity: 1, backgroundColor: 'red' },
        { opacity: 1, offset: 0.8 },
        { opacity: 0, offset: 0.8001 },
        { opacity: 0, offset: 0.9999 },
      ],
      {
        duration: DEATH_DURATION,
        easing: 'ease-out',
        fill: 'forwards',
      }
    );

    const heathAnimation = health.animate(
      [
        { opacity: 0, },
        { opacity: 0, offset: 0.9999 },
      ],
      {
        duration: DEATH_DURATION,
      }
    )
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
    img.style.transform = 'rotate(0deg)';
    currentPositionRef.current = 0;
    facingRightRef.current = false;
    setAnimationState('walking');
    spawnNewMonster();

    setTimeout(() => {
      img.style.transform = 'rotate(0deg)';
    }, 0);
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
        src={new URL(`../assets/monsters/${monster.toLowerCase()}.png`, import.meta.url).href}
        alt={monster}
        style={{
          height: '100%',
        }}
      />
    </div>
  );
};

export default MonsterAnimation;
