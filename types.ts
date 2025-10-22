// types.ts
// Core data interfaces for HFL, incorporating Apzu (Order) and Tiama'at (Chaos) principles.

// Defines the tiered rarity system for all HFL assets.
export type Rarity =
  | 'THIRSTY I'
  | 'THIRSTY II'
  | 'STRUGGLE I'
  | 'STRUGGLE II'
  | 'CLAY'
  | 'MARBLE'
  | 'SILVER'
  | 'GOLD'
  | 'JAYMOND'
  | 'UNOBMAHNEUM'
  | 'GLAMOURSHINE'
  | 'GLAMOURBEAN'
  | 'ZORI';

// Defines all possible player positions in the league.
export type Position = 'QB' | 'FB' | 'RB' | 'WR' | 'TE' | 'OL' | 'DL' | 'LB' | 'CB' | 'S' | 'K' | 'P' | 'LS' | 'KR' | 'PR';

// Represents a single team in the Heart Football League.
export interface Team {
  id: string;
  city: string;
  name: string;
  colors: string[];
  conference: string;
  division: string;
  offensive_playbook: string;
  defensive_playbook: string;
  stadium: { name: string; capacity: number };
  media_market: string;
  mega_chalices: number;
  roster: string[];
  wins: number;
  losses: number;
  ties: number;
  theme?: string;
  mascot?: string;
}

// Represents a single player in the Heart Football League.
export interface Player {
  id: string;
  name: string;
  position: Position;
  teamId?: string;
  overall: number;
  age?: number;
  potential?: number;
  contract?: { years: number; salaryPerYear: number; };
  apzuExecutionScore: number;
  tiamaatChaosRating: number;
  stats: { [key: string]: number };
  rarity: Rarity;
  injury?: { type: string; duration: number };
  holographic_intensity: number;
  shall_to_power_ability: string;
}

// Represents a player available in the draft pool.
export interface DraftProspect {
  id: string;
  name: string;
  position: Position;
  overall: number;
  potential: number;
  stats: { [key: string]: number };
}

// Represents a player available in free agency.
export interface FreeAgent {
  id: string;
  name: string;
  position: Position;
  overall: number;
  stats: { [key: string]: number };
  salary: number;
}

// Represents a crafting recipe in the Foundry.
export interface Blueprint {
  id: string;
  output: { name?: string; rarity: Rarity };
  requirements: { [partId: string]: number };
  stat_boosts: { [key: string]: number };
}

// Represents a crafting material for the Foundry.
export interface FoundryPart {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
}

// Represents a daily fantasy sports contest.
export interface FantasyContest {
  id: number;
  name: string;
  status: 'Live' | 'Upcoming' | 'Completed';
  prizePool: number;
  entryFee: number;
}

// Represents a reward that can be purchased with fantasy points.
export interface FantasyReward {
  id: number;
  name: string;
  description: string;
  cost: number;
}

// Represents a single game matchup between two teams.
export interface Matchup {
  home: Team;
  away: Team;
  score: { home: number; away: number };
  downs: number;
  yardLine: number;
}

// Represents a play call in the game simulator.
export interface Play {
  id: string;
  type: 'Run' | 'Pass' | 'Special';
  outcome: 'Success' | 'Failure' | 'Chaos';
  effect: string;
  yardage: number;
}

// Represents a single event that occurs during a game.
export interface GameEvent {
  time: string;
  teamId: string | undefined;
  playerId: string;
  description: string;
}

// Represents the core statistical attributes of a player.
export type PlayerStats = {
  speed: number;
  strength: number;
  agility: number;
  throwingPower?: number;
  catching?: number;
  tackling?: number;
  vision?: number;
  elusiveness?: number;
  toughness?: number;
};

// Represents a single entry in the in-game lore codex.
export interface CodexEntry {
    id: string;
    title: string;
    description: string;
    relatedConcepts: string[];
}
