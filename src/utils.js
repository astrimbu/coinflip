export const getColor = (rarity) => {
  const colors = {
    Common: "#4CAF50",
    Magic: "#3B88FF",
    Rare: "#F44336",
    Unique: "#000",
    Crystal: "#80d3da",
  };
  return colors[rarity] || "#000000";
};

export const getBackgroundColor = (rarity) => {
  if (rarity === 'Unique') {
    return 'rgba(0, 0, 0, 0.3)';
  }
  const color = getColor(rarity);
  return `${color}33`; // 33 is 20% opacity in hex for other rarities
};

export const getRarityStat = (rarity) => {
  switch (rarity) {
    case "Common":
      return 1;
    case "Magic":
      return 2;
    case "Rare":
      return 3;
    case "Unique":
      return 5;
    default:
      return 0;
  }
};

export const getItemUrl = (name, rarity) => {
  if (name) name = name.toLowerCase();
  if (rarity) rarity = rarity.toLowerCase();
  if (['crystal', 'potion', 'gold', 'logs'].includes(name)) {
    return `/coinflip/assets/items/${name}.png`;
  } else if (name === 'fire') {
    return `/coinflip/assets/items/fire.gif`;
  }
  return `/coinflip/assets/items/${name}-${rarity}.png`;
};


export const calcStats = (equipment) => {
  return Object.values(equipment).reduce((total, item) => {
    return total + (item && item.stat ? item.stat : 0);
  }, 0);
};


export const calcWinRate = (totalStats, baseRate) => {
  const statBonus = Math.floor(totalStats / 6) + totalStats * 0.1;
  return Math.min(baseRate * Math.pow(2, statBonus), 1);
};

export const xpToNextLevel = (currentLevel) => Math.floor(100 * Math.pow(1.5, currentLevel - 1));

export const compareRarity = (rarity1, rarity2) => {
  const rarityOrder = ['Common', 'Magic', 'Rare', 'Unique'];
  return rarityOrder.indexOf(rarity1) - rarityOrder.indexOf(rarity2);
};

export const calcItemDropRate = (baseChance, modifier, crystalTimer) => {
  return (baseChance * modifier * (crystalTimer > 0 ? 2 : 1) * 100);
};

export const calcAccuracy = (userStats, monster) => {
  const baseAccuracy = 0.6;
  const statDifference = userStats - monster.defense;
  const accuracyModifier = Math.min(Math.max(statDifference * 0.02, -0.3), 0.3);
  return Math.min(Math.max(baseAccuracy + accuracyModifier, 0.1), 0.95);
};

export const calcMonsterAccuracy = (monsterAttack, userStats) => {
  const baseAccuracy = 0.3;
  const statDifference = monsterAttack - userStats;
  const accuracyModifier = Math.min(Math.max(statDifference * 0.02, -0.3), 0.3);
  return Math.min(Math.max(baseAccuracy + accuracyModifier, 0.1), 0.95);
};

export const getNextRarity = (currentRarity) => {
  const rarityOrder = ['Common', 'Magic', 'Rare', 'Unique'];
  const currentIndex = rarityOrder.findIndex(rarity => compareRarity(rarity, currentRarity) === 0);
  return currentIndex < rarityOrder.length - 1 ? rarityOrder[currentIndex + 1] : null;
};
