export const TUTORIAL_STEPS = [
  {
    id: 'monster_click',
    text: "Click on the monster to fight",
    position: {
      main: {
        top: 'calc(50% + 90px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }
  },
  {
    id: 'fighting',
    text: "Fighting...",
    position: {
      main: {
        top: 'calc(50% + 90px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      additional: [
        {
          top: 'calc(100% - 110px)',
          left: '70%',
          transform: 'translate(-48%, 0)',
          text: 'This is your health bar.',
        }
      ]
    }
  },
  {
    id: 'equip_item',
    text: "You got a weapon! Click it to equip",
    position: {
      main: {
        top: '100px',
        left: '30px',
        transform: 'none',
      }
    },
    highlight: {
      type: 'inventory_slot',
      slot: 0
    }
  },
  {
    id: 'use_potion',
    text: "Click the potion to boost your damage",
    position: {
      main: {
        top: '60px',
        left: '110px',
        transform: 'none',
      }
    },
    highlight: {
      type: 'potion'
    }
  },
  {
    id: 'attack_monster',
    text: "Attack the monster while potted",
    position: {
      main: {
        top: 'calc(50% + 90px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    },
    highlight: {
      type: 'monster'
    }
  },
  {
    id: 'go_town',
    text: "Go to Town by clicking the Town button",
    position: {
      main: {
        top: 'calc(100% - 85px)',
        left: '75px',
        transform: 'none',
      }
    }
  },
  {
    id: 'return_game',
    text: "Return to the game by clicking the Monster icon",
    position: {
      main: {
        top: 'calc(50% + 90px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      additional: [
        {
          top: 'calc(50% - 110px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          text: 'Town is a safe place to escape monsters, buy items, and more.',
        }
      ]
    },
    highlight: {
      type: 'monster_icon'
    }
  }
]; 