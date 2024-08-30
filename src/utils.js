export const getColor = (rarity) => {
    const colors = {
      Common: '#4CAF50',
      Magic: '#3B88FF',
      Rare: '#F44336',
      Unique: '#000',
      Crystal: '#80d3da',
    };
    return colors[rarity] || '#000000';
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
