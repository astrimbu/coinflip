import { useReducer, useCallback } from 'react';

// Constants
const MAX_INVENTORY_SLOTS = 16;

// Action types
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const EQUIP_ITEM = 'EQUIP_ITEM';
const UNEQUIP_ITEM = 'UNEQUIP_ITEM';
const UPDATE_CURRENCY = 'UPDATE_CURRENCY';
const RECYCLE_ITEMS = 'RECYCLE_ITEMS';
const REMOVE_SCRAP = 'REMOVE_SCRAP';

// Utility functions
const countInventoryItems = (inventory) => {
  return Object.values(inventory).reduce((sum, items) => 
    sum + (Array.isArray(items) ? items.length : 0), 0);
};

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM:
      if (countInventoryItems(state.inventory) >= MAX_INVENTORY_SLOTS) {
        return { ...state, inventoryFull: true };
      }
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.payload.category]: [...state.inventory[action.payload.category], action.payload.item]
        },
        inventoryFull: countInventoryItems(state.inventory) + 1 >= MAX_INVENTORY_SLOTS
      };
    case REMOVE_ITEM:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.payload.category]: state.inventory[action.payload.category].filter(item => item !== action.payload.item)
        },
        inventoryFull: false
      };
    case EQUIP_ITEM:
      const { item, slot } = action.payload;
      const updatedInventory = {
        ...state.inventory,
        [item.name]: state.inventory[item.name].filter(i => i !== item)
      };
      const updatedEquipment = { ...state.equipment, [slot]: item };
      if (state.equipment[slot]) {
        updatedInventory[state.equipment[slot].name] = [...updatedInventory[state.equipment[slot].name], state.equipment[slot]];
      }
      return {
        ...state,
        inventory: updatedInventory,
        equipment: updatedEquipment,
        inventoryFull: countInventoryItems(updatedInventory) >= MAX_INVENTORY_SLOTS
      };
    case UNEQUIP_ITEM:
      if (countInventoryItems(state.inventory) >= MAX_INVENTORY_SLOTS) {
        return { ...state, inventoryFull: true };
      }
      const unequippedItem = state.equipment[action.payload.slot];
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [unequippedItem.name]: [...state.inventory[unequippedItem.name], unequippedItem]
        },
        equipment: { ...state.equipment, [action.payload.slot]: null },
        inventoryFull: countInventoryItems(state.inventory) + 1 >= MAX_INVENTORY_SLOTS
      };
    case UPDATE_CURRENCY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.payload.currency]: state.inventory[action.payload.currency] + action.payload.amount
        }
      };
    case RECYCLE_ITEMS:
      const recycledInventory = { ...state.inventory };
      const updatedScrap = { ...state.scrap };
      action.payload.items.forEach(item => {
        recycledInventory[item.name] = recycledInventory[item.name].filter(i => i !== item);
        updatedScrap[item.rarity]++;
      });
      return {
        ...state,
        inventory: recycledInventory,
        scrap: updatedScrap,
        inventoryFull: false
      };
    case REMOVE_SCRAP:
      const newScrap = { ...state.scrap };
      const rarity = action.payload.rarity;
      newScrap[rarity] -= 2;
      return {
        ...state,
        scrap: newScrap,
      };
    default:
      return state;
  }
};

const useInventoryManager = () => {
  const [state, dispatch] = useReducer(inventoryReducer, {
    inventory: {
      Weapon: [],
      Hat: [],
      Cape: [],
      Body: [],
      Pants: [],
      Gloves: [],
      Boots: [],
      Ring: [],
      Amulet: [],
      Crystal: [],
      Gold: 1,
      Potion: 1,
    },
    equipment: {
      Hat: null,
      Weapon: null,
      Cape: null,
      Body: null,
      Pants: null,
      Gloves: null,
      Boots: null,
      Ring: null,
      Amulet: null,
    },
    scrap: { Common: 0, Magic: 0, Rare: 0, Unique: 0 },
    inventoryFull: false
  });

  const addItem = useCallback((category, item) => {
    dispatch({ type: ADD_ITEM, payload: { category, item } });
  }, []);

  const removeItem = useCallback((category, item) => {
    dispatch({ type: REMOVE_ITEM, payload: { category, item } });
  }, []);

  const equipItem = useCallback((item, slot) => {
    dispatch({ type: EQUIP_ITEM, payload: { item, slot } });
  }, []);

  const unequipItem = useCallback((slot) => {
    dispatch({ type: UNEQUIP_ITEM, payload: { slot } });
  }, []);

  const updateCurrency = useCallback((currency, amount) => {
    dispatch({ type: UPDATE_CURRENCY, payload: { currency, amount } });
  }, []);

  const recycleItems = useCallback((items) => {
    dispatch({ type: RECYCLE_ITEMS, payload: { items } });
  }, []);

  const removeScrap = useCallback((rarity) => {
    dispatch({ type: REMOVE_SCRAP, payload: { rarity } });
  }, []);

  return {
    inventory: state.inventory,
    equipment: state.equipment,
    scrap: state.scrap,
    inventoryFull: state.inventoryFull,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    updateCurrency,
    recycleItems,
    removeScrap,
  };
};

export default useInventoryManager;