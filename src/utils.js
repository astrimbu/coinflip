export const getColor = (rarity, difficulty) => {
    const colors = {
      Common: '#4CAF50', easy: '#4CAF50',
      Magic: '#3B88FF', medium: '#3B88FF',
      Rare: '#F44336', hard: '#F44336',
      Unique: '#000', impossible: '#000',
      Crystal: '#80d3da',
    };
    return colors[rarity] || colors[difficulty] || '#000000';
};

export const getRarityStat = (rarity) => {
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
