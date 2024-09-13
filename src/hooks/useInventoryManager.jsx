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
const DEPOSIT_ITEM = 'DEPOSIT_ITEM';
const WITHDRAW_ITEM = 'WITHDRAW_ITEM';

// Utility functions
const countInventoryItems = (inventory) => {
  return Object.values(inventory).reduce((sum, items) =>
    sum + (Array.isArray(items) ? items.length : 0), 0);
};

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const { category, item } = action.payload;
      const itemId = new Date().toISOString();

      if (countInventoryItems(state.inventory) >= MAX_INVENTORY_SLOTS) {
        return { ...state, inventoryFull: true };
      }
      
      const updatedItem = { ...item, id: itemId };
      const updatedInventory = {
        ...state.inventory,
        [category]: [...state.inventory[category], updatedItem]
      };

      return {
        ...state,
        inventory: updatedInventory,
        inventoryFull: countInventoryItems(updatedInventory) >= MAX_INVENTORY_SLOTS
      };
    }
    case REMOVE_ITEM:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.payload.category]: state.inventory[action.payload.category].filter(item => item.id !== action.payload.item.id)
        },
        inventoryFull: false
      };
    case EQUIP_ITEM: {
      const { item, slot } = action.payload;
      const updatedInventory = { ...state.inventory };
      const updatedEquipment = { ...state.equipment };
      if (slot !== null) {  // If the item is being equipped from the inventory
        updatedInventory[item.name] = updatedInventory[item.name].filter(i => i.id !== item.id);
      }
      if (updatedEquipment[item.name]) {  // If there's an item already equipped
        const previousItem = updatedEquipment[item.name];
        updatedInventory[previousItem.name] = [...updatedInventory[previousItem.name], previousItem];
      }
      updatedEquipment[item.name] = item;
      return {
        ...state,
        inventory: updatedInventory,
        equipment: updatedEquipment,
        inventoryFull: countInventoryItems(updatedInventory) >= MAX_INVENTORY_SLOTS
      };
    }
    case UNEQUIP_ITEM: {
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
    }
    case UPDATE_CURRENCY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [action.payload.currency]: state.inventory[action.payload.currency] + action.payload.amount
        }
      };
    case RECYCLE_ITEMS: {
      const recycledInventory = { ...state.inventory };
      const updatedScrap = { ...state.scrap };
      action.payload.items.forEach(item => {
        recycledInventory[item.name] = recycledInventory[item.name].filter(i => i.id !== item.id);
        updatedScrap[item.rarity]++;
      });
      return {
        ...state,
        inventory: recycledInventory,
        scrap: updatedScrap,
        inventoryFull: false
      };
    }
    case REMOVE_SCRAP: {
      const newScrap = { ...state.scrap };
      const rarity = action.payload.rarity;
      newScrap[rarity] -= 2;
      return {
        ...state,
        scrap: newScrap,
      };
    }
    case DEPOSIT_ITEM: {
      const { category, item } = action.payload;
      const updatedInventory = { ...state.inventory };
      const updatedBankItems = { ...state.bankItems };

      // Create a key for the item based on its name and rarity
      const itemKey = `${item.name}_${item.rarity}`;

      // Remove item from inventory
      updatedInventory[category] = updatedInventory[category].filter(i => i.id !== item.id);
      
      // Add item to the stack in bank
      if (!updatedBankItems[itemKey]) {
        updatedBankItems[itemKey] = [];
      }
      updatedBankItems[itemKey] = [...updatedBankItems[itemKey], item];

      return {
        ...state,
        inventory: updatedInventory,
        bankItems: updatedBankItems,
        inventoryFull: false,
      };
    }
    case WITHDRAW_ITEM: {
      const { category, itemKey } = action.payload;
      const updatedInventory = { ...state.inventory };
      const updatedBankItems = { ...state.bankItems };

      if (updatedBankItems[itemKey] && updatedBankItems[itemKey].length > 0) {
        // Create a new array without the last item
        const newBankItemStack = updatedBankItems[itemKey].slice(0, -1);
        const item = updatedBankItems[itemKey][updatedBankItems[itemKey].length - 1];

        // Update bank items
        if (newBankItemStack.length === 0) {
          delete updatedBankItems[itemKey];
        } else {
          updatedBankItems[itemKey] = newBankItemStack;
        }

        // Check if the item is already in the inventory
        const itemAlreadyInInventory = updatedInventory[category]?.some(invItem => invItem.id === item.id);

        if (!itemAlreadyInInventory) {
          // Add item to inventory only if it's not already there
          if (!updatedInventory[category]) {
            updatedInventory[category] = [];
          }
          updatedInventory[category] = [...updatedInventory[category], item];
        }

        return {
          ...state,
          inventory: updatedInventory,
          bankItems: updatedBankItems,
          inventoryFull: countInventoryItems(updatedInventory) >= MAX_INVENTORY_SLOTS,
        };
      } else {
        return state;
      }
    }
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
      Logs: [],
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
    inventoryFull: false,
    recentItems: [],
    bankItems: {}
  });

  const addItem = useCallback((category, item) => {
    dispatch({ type: ADD_ITEM, payload: { category, item } });
  }, []);

  const removeItem = useCallback((category, item) => {
    dispatch({ type: REMOVE_ITEM, payload: { category, item } });
  }, []);

  const equipItem = useCallback((item, slot = null) => {
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

  const depositItem = useCallback((category, item) => {
    dispatch({ type: DEPOSIT_ITEM, payload: { category, item } });
  }, []);

  const withdrawItem = useCallback((category, itemKey) => {
    dispatch({ type: WITHDRAW_ITEM, payload: { category, itemKey } });
  }, []);

  return {
    inventory: state.inventory,
    equipment: state.equipment,
    scrap: state.scrap,
    inventoryFull: state.inventoryFull,
    recentItems: state.recentItems,
    bankItems: state.bankItems,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    updateCurrency,
    recycleItems,
    removeScrap,
    depositItem,
    withdrawItem,
  };
};

export default useInventoryManager;
