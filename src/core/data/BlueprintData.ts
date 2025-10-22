import { Blueprint, Rarity } from '../../types';

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'ASCENSION_CLAY_TO_GLAMOURSHINE',
    output: { rarity: 'GLAMOURSHINE' as Rarity },
    requirements: {
      'Apzu_Order_Essence': 75,
      'Tiamaat_Chaos_Spark': 25,
      'Dynarelly_Tokens': 50000
    },
    stat_boosts: {
      Apzu_Execution_Min: 75,
      Tiamaat_Chaos_Max: 30,
      All_Base_Stats_Multiplier: 1.2
    }
  },
  {
    id: 'WILL_TO_POWER_UPGRADE_1',
    output: { rarity: 'GLAMOURSHINE' as Rarity },
    requirements: {
      'Glamourshine_Platinum_Dust': 10,
      'Dynarelly_Tokens': 10000
    },
    stat_boosts: {
      Will_to_Power_Effectiveness: 1.1
    }
  },
  {
    id: 'ZORI_ASCENSION',
    output: { rarity: 'ZORI' as Rarity },
    requirements: {
      'Vantablack_Essence': 50,
      'Violet_Diamond_Shard': 20,
      'Dynarelly_Tokens': 200000
    },
    stat_boosts: {
      Apzu_Execution_Min: 90,
      Tiamaat_Chaos_Max: 80,
      All_Base_Stats_Multiplier: 1.5
    }
  }
];
