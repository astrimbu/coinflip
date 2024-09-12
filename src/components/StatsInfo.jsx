import React from 'react';
import { calcStats, calcAccuracy, calcItemDropRate, calcMonsterAccuracy } from '../utils';

const StatsInfo = ({ equipment, currentMonster, monsterTypes, crystalTimer }) => {
  const [showDetailedStats, setShowDetailedStats] = React.useState(false);

  const toggleDetailedStats = () => setShowDetailedStats(!showDetailedStats);

  return (
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
          alignItems: 'baseline',
          cursor: 'pointer',
        }}
        onClick={toggleDetailedStats}
      >
        <span style={{ fontSize: '1.2em' }}>Stats:</span>
        <span style={{ fontSize: '1.4em', fontWeight: 'bold', marginLeft: '5px' }}>
          {calcStats(equipment)}
        </span>
        <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>
          {showDetailedStats ? '▲' : '▼'}
        </span>
      </div>
      {showDetailedStats && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.8em' }}>Accuracy:</span>
            <span style={{ fontSize: '1em' }}>
              {(calcAccuracy(calcStats(equipment), monsterTypes[currentMonster]) * 100).toFixed(2)}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.8em' }}>Drop rate:</span>
            <span style={{ fontSize: '1em' }}>
              {calcItemDropRate(0.1, monsterTypes[currentMonster].modifier, crystalTimer).toFixed(2)}%
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.8em' }}>Monster accuracy:</span>
            <span style={{ fontSize: '1em' }}>
              {(calcMonsterAccuracy(monsterTypes[currentMonster].attack, calcStats(equipment)) * 100).toFixed(2)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsInfo;
