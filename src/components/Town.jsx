import React from 'react';
import { MIN_HEIGHT_VIEW } from '../constants/gameData';

const Town = ({ goToLocation }) => {
  const services = [
    { name: 'Recycler', image: '🔄' },
    { name: 'Bank', image: '🏦' },
    { name: 'Shop', image: '🛒' },
    { name: 'Pond', image: '🎣' },
    { name: 'Stats', image: '📈' },
    { name: 'Grid', image: '🔲' },
  ];

  const monsterService = { name: 'Grid', image: '🔲' }; // Changed from 'Monster' to 'Grid'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: MIN_HEIGHT_VIEW,
    }}>
      <div style={{
        position: 'relative',
        width: '400px',
        height: '400px',
      }}>
        <ServiceButton
          service={monsterService}
          goToLocation={goToLocation}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {services.map((service, index) => (
          <ServiceButton
            key={service.name}
            service={service}
            goToLocation={goToLocation}
            style={{
              position: 'absolute',
              top: `${50 + 35 * Math.sin(index * Math.PI / 3)}%`,
              left: `${50 + 35 * Math.cos(index * Math.PI / 3)}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ServiceButton = ({ service, goToLocation, style }) => {
  const isGrid = service.name === 'Grid'; // Changed from 'Monster' to 'Grid'

  return (
    <div
      onClick={() => goToLocation(isGrid ? 'game' : service.name.toLowerCase())}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: isGrid ? '#CD5C5C' : '#ddd',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '10px',
        transition: 'background-color 0.3s, transform 0.3s',
        transform: isGrid ? 'scale(1.1)' : 'scale(1)',
        transformOrigin: 'top left',
        boxShadow: isGrid ? '0 0 15px rgba(0,0,0,0.2)' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isGrid ? '#A52A2A' : '#bbb';
        e.currentTarget.style.transform = `${isGrid ? 'scale(1.15)' : 'scale(1.05)'} translate(-50%, -50%)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isGrid ? '#CD5C5C' : '#ddd';
        e.currentTarget.style.transform = `${isGrid ? 'scale(1.1)' : 'scale(1)'} translate(-50%, -50%)`;
      }}
    >
      <div style={{ fontSize: '48px' }}>{service.image}</div>
      <div style={{ color: isGrid ? 'white' : 'black', fontWeight: isGrid ? 'bold' : 'normal' }}>
        {service.name}
      </div>
    </div>
  );
};

export default Town;
