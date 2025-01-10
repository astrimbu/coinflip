export const monsterTypes = {
  Goblin: {
    label: "Goblin",
    rate: 1 / 2,
    maxHP: 4,
    modifier: 6,
    rarity: "Common",
    experience: 40,
    ticketCost: 0,
    order: 0,
    damage: 1,
    stats: 1,
    level: 3,
  },
  Ogre: {
    label: "Ogre",
    rate: 1 / 6,
    maxHP: 6,
    modifier: 4,
    rarity: "Magic",
    experience: 200,
    ticketCost: 1,
    order: 1,
    damage: 2,
    stats: 10,
    level: 20,
  },
  Demon: {
    label: "Demon",
    rate: 1 / 40,
    maxHP: 10,
    modifier: 2,
    rarity: "Rare",
    experience: 500,
    ticketCost: 2,
    order: 2,
    damage: 4,
    stats: 20,
    level: 50,
  },
  Dragon: {
    label: "Dragon",
    rate: 1 / 150,
    maxHP: 34,
    modifier: 1,
    rarity: "Unique",
    experience: 2000,
    ticketCost: 3,
    order: 3,
    damage: 6,
    stats: 30,
    level: 120,
  },
};

export const petDropRates = Object.fromEntries(
  Object.keys(monsterTypes).map((monster) => [monster, 1 / 1000]),
);

export const MIN_HEIGHT_VIEW = "314px";
export const ATTACK_SPEED = 1200;
export const FIRE_LENGTH = 60;

export const TREE_LIMITS = {
  auto: 1,
  damage: 5,
  experience: 5,
  moreDamage: 5,
  goldBonus: 5,
  stats: 10
};
