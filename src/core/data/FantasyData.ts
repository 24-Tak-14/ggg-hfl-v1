import { FantasyContest, FantasyReward } from '../../types';

// Mock data for available Daily Fantasy contests.
export const FANTASY_CONTESTS: FantasyContest[] = [
  {
    id: 1,
    name: 'Sunday Gridiron Rush',
    status: 'Live',
    prizePool: 100000,
    entryFee: 25,
  },
  {
    id: 2,
    name: 'Chaos Cauldron - Single Game',
    status: 'Live',
    prizePool: 50000,
    entryFee: 10,
  },
  {
    id: 3,
    name: 'Weekly Apzu Analyst',
    status: 'Upcoming',
    prizePool: 75000,
    entryFee: 15,
  },
  {
    id: 4,
    name: 'Thirsty Tier Throwdown',
    status: 'Upcoming',
    prizePool: 10000,
    entryFee: 1,
  },
];

// Mock data for rewards available for purchase with fantasy points.
export const FANTASY_REWARDS: FantasyReward[] = [
    {
        id: 1,
        name: 'Common Foundry Pack',
        description: 'Contains a random assortment of Clay and Marble tier foundry parts.',
        cost: 500,
    },
    {
        id: 2,
        name: 'Apzu Order Essence',
        description: 'A key component for disciplined player ascension in the Foundry.',
        cost: 1500,
    },
    {
        id: 3,
        name: 'Tiama’at Chaos Spark',
        description: 'A volatile spark needed for unpredictable upgrades in the Foundry.',
        cost: 2000,
    },
    {
        id: 4,
        name: 'SILVER Player Card',
        description: 'Grants one random player card of SILVER rarity.',
        cost: 5000,
    },
    {
        id: 5,
        name: '10,000 Dynarelly Tokens',
        description: 'The universal currency for all Foundry and league transactions.',
        cost: 1000,
    },
];