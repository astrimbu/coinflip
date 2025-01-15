import React from 'react';
import { MIN_HEIGHT_VIEW } from '../constants/gameData';

const Town = ({ goToLocation, isHighlightingMonster }) => {
  const services = [
    { name: 'Shop', image: '🛒' },
    { name: 'Bank', image: '🏦' },
    { name: 'Monster', image: '👹', isMonster: true },
    { name: 'Recycler', image: '🔄' },
  ];

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
      }}>
        {services.map((service) => (
          <ServiceButton
            key={service.name}
            service={service}
            goToLocation={goToLocation}
            isHighlighted={service.isMonster && isHighlightingMonster}
          />
        ))}
      </div>
    </div>
  );
};

const ServiceButton = ({ service, goToLocation, isHighlighted }) => {
  const isMonster = service.isMonster;

  return (
    <div
      onClick={() => goToLocation(isMonster ? 'game' : service.name.toLowerCase())}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: isMonster ? '#CD5C5C' : '#ddd',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '10px',
        transition: 'background-color 0.3s, transform 0.3s',
        transform: isMonster ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isHighlighted ? '0 0 15px yellow' : (isMonster ? '0 0 15px rgba(0,0,0,0.2)' : 'none'),
        animation: isHighlighted ? 'pulse 1s infinite' : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isMonster ? '#A52A2A' : '#bbb';
        e.currentTarget.style.transform = isMonster ? 'scale(1.15)' : 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isMonster ? '#CD5C5C' : '#ddd';
        e.currentTarget.style.transform = isMonster ? 'scale(1.1)' : 'scale(1)';
      }}
    >
      <div style={{ fontSize: '48px' }}>{service.image}</div>
      <div style={{ color: isMonster ? 'white' : 'black', fontWeight: isMonster ? 'bold' : 'normal' }}>
        {service.name}
      </div>
    </div>
  );
};

export default Town;
