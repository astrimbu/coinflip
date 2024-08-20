import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import AdventureGame from './AdventureGame';
// import useInventoryManager from './useInventoryManager';

vi.mock('./useInventoryManager', () => ({
  default: vi.fn(() => ({
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
      Gold: 10,
      Potion: 1,
    },
    equipment: {},
    scrap: { Common: 0, Magic: 0, Rare: 0, Unique: 0 },
    inventoryFull: false,
    addItem: vi.fn(),
    removeItem: vi.fn(),
    equipItem: vi.fn(),
    unequipItem: vi.fn(),
    updateCurrency: vi.fn(),
    recycleItems: vi.fn(),
    removeScrap: vi.fn(),
  })),
}));

describe('AdventureGame', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1500,
    });

    Element.prototype.animate = vi.fn(() => ({
      onfinish: null,
    }));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AdventureGame />);
    expect(screen.getByRole('heading', { name: 'Adventure Game' })).toBeDefined();
  });

  it('displays the correct initial gold amount', () => {
    render(<AdventureGame />);
    const goldSection = screen.getByTestId('Gold');
    expect(within(goldSection).getByText('10')).toBeDefined();
  });

  it('changes monster when a difficulty button is clicked', () => {
    render(<AdventureGame />);
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }));
    expect(screen.getByAltText('Ogre')).toBeDefined();
  });

  it('starts fighting when the Fight Monster button is clicked', () => {
    vi.useFakeTimers();
    render(<AdventureGame />);
    fireEvent.click(screen.getByRole('button', { name: /Fight Monster/ }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByText('Fighting...')).toBeDefined();
    expect(Element.prototype.animate).toHaveBeenCalled();
  });

  //  it('updates timer when using a crystal', async () => {
  //    await act(async () => {
  //      render(<AdventureGame />);
  //    });
  //    const useCrystalButton = screen.getByRole('button', { name: /Use CrystalgetAllByTest/i });
  //    await act(async () => {
  //      fireEvent.click(useCrystalButton);
  //    });
  //    act(() => {
  //      vi.advanceTimersByTime(1000);
  //    });
  //    expect(screen.getByText(/Crystal Boost: 4:59/)).toBeDefined();
  //  });
  //
  //  it('adds an item to the inventory when checkForItem is called', async () => {
  //    const { addItem } = useInventoryManager();
  //    vi.spyOn(Math, 'random').mockReturnValue(0.05);
  //    render(<AdventureGame />);
  //    fireEvent.click(screen.getByRole('button', { name: 'Fight Monster' }));
  //    // Wait for the item to be added (you might need to adjust the timing)
  //    await vi.waitFor(() => {
  //      expect(addItem).toHaveBeenCalled();
  //    });
  //  });
  //
  //  it('updates the inventory when an item is equipped', async () => {
  //    const { equipItem } = useInventoryManager();
  //    render(<AdventureGame />);
  //    // Assume we have a weapon in the inventory
  //    const weaponButton = screen.getByRole('button', { name: 'Weapon' });
  //    fireEvent.click(weaponButton);
  //    await vi.waitFor(() => {
  //      expect(equipItem).toHaveBeenCalledWith(expect.objectContaining({ name: 'Weapon' }), 'Weapon');
  //    });
  //  });
  //
  //  it('updates currency when purchasing from the shop', async () => {
  //    const { updateCurrency } = useInventoryManager();
  //    render(<AdventureGame />);
  //    const shopSection = screen.getByRole('region', { name: 'Shop' });
  //    const buyButton = within(shopSection).getByRole('button', { name: 'Buy' });
  //    fireEvent.click(buyButton);
  //    await vi.waitFor(() => {
  //      expect(updateCurrency).toHaveBeenCalledWith('Gold', -1);
  //    });
  //  });
});
