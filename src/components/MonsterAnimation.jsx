/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';

const MonsterAnimation = ({ isAttacking, onAnimationEnd, monster, hitpoints, maxHP }) => {
  const monsterRef = useRef(null);

  useEffect(() => {
    if (isAttacking && monsterRef.current) {
      monsterRef.current.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(10px)' },
          { transform: 'translateX(-10px)' },
          { transform: 'translateX(0)' },
        ],
        {
          duration: 300,
          easing: 'ease-in-out',
        }
      ).onfinish = onAnimationEnd;
    }
  }, [isAttacking, onAnimationEnd]);

  return (
    <div
      ref={monsterRef}
      style={{
        width: '100px',
        height: '100px',
        margin: '20px auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src={new URL(`../assets/monsters/${monster.toLowerCase()}.png`, import.meta.url).href}
        alt={monster}
        style={{
          height: '100%',
        }}
      />
      <div style={{ width: '100%', height: '10px', backgroundColor: 'red', marginTop: '10px' }}>
        <div
          style={{
            width: `${(hitpoints / maxHP) * 100}%`,
            height: '10px',
            backgroundColor: 'green',
          }}
        />
      </div>
    </div>
  );
};

export default MonsterAnimation;
