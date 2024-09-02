export const monsterTypes = {
  Goblin: {
    label: "Goblin",
    rate: 1 / 2,
    maxHP: 4,
    modifier: 6,
    rarity: "Common",
    experience: 10,
    ticketCost: 0,
    order: 0,
  },
  Ogre: {
    label: "Ogre",
    rate: 1 / 6,
    maxHP: 6,
    modifier: 4,
    rarity: "Magic",
    experience: 50,
    ticketCost: 1,
    order: 1,
  },
  Demon: {
    label: "Demon",
    rate: 1 / 40,
    maxHP: 10,
    modifier: 2,
    rarity: "Rare",
    experience: 100,
    ticketCost: 2,
    order: 2,
  },
  Dragon: {
    label: "Dragon",
    rate: 1 / 300,
    maxHP: 34,
    modifier: 1,
    rarity: "Unique",
    experience: 200,
    ticketCost: 3,
    order: 3,
  },
};

export const petDropRates = Object.fromEntries(
  Object.keys(monsterTypes).map((monster) => [monster, 1 / 1000]),
);

export const MIN_HEIGHT_VIEW = "300px";

