import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import MiniRPG from './MiniRPG';
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

describe('MiniRPG', () => {
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
    render(<MiniRPG />);
    expect(screen.getByRole('heading', { name: 'Adventure Game' })).toBeDefined();
  });

  it('displays the correct initial gold amount', () => {
    render(<MiniRPG />);
    const goldSection = screen.getByTestId('Gold');
    expect(within(goldSection).getByText('10')).toBeDefined();
  });

  it('changes monster when a difficulty button is clicked', () => {
    render(<MiniRPG />);
    fireEvent.click(screen.getByRole('button', { name: 'Medium' }));
    expect(screen.getByAltText('Ogre')).toBeDefined();
  });

  it('starts fighting when the Fight Monster button is clicked', () => {
    vi.useFakeTimers();
    render(<MiniRPG />);
    fireEvent.click(screen.getByRole('button', { name: /Fight Monster/ }));
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByText('Fighting...')).toBeDefined();
    expect(Element.prototype.animate).toHaveBeenCalled();
  });
});
