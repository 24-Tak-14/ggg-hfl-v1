import { FreeAgent } from '../../types';

// This file contains mock data for free agents available in the league.
export const FREE_AGENTS: FreeAgent[] = [
  // Quarterbacks
  { id: 'FA-QB-01', name: 'Marco "The Pocket" Polo', position: 'QB', overall: 84, stats: { throwingPower: 88, vision: 85 }, salary: 15000000 },
  { id: 'FA-QB-02', name: 'Ken "The Gun" Stabler', position: 'QB', overall: 78, stats: { throwingPower: 92, vision: 75 }, salary: 8000000 },
  { id: 'FA-QB-03', name: 'Ty Detmer', position: 'QB', overall: 72, stats: { throwingPower: 80, vision: 80 }, salary: 2500000 },

  // Running Backs
  { id: 'FA-RB-01', name: 'Barry "The Ghost" Sanders', position: 'RB', overall: 88, stats: { speed: 95, elusiveness: 98 }, salary: 18000000 },
  { id: 'FA-RB-02', name: 'Tiki Barber', position: 'RB', overall: 79, stats: { speed: 88, elusiveness: 85 }, salary: 6000000 },
  { id: 'FA-RB-03', name: 'Jamal Anderson', position: 'RB', overall: 75, stats: { speed: 85, toughness: 90 }, salary: 3500000 },

  // Wide Receivers
  { id: 'FA-WR-01', name: 'Deion "Prime Time" Sanders', position: 'WR', overall: 85, stats: { speed: 99, catching: 85 }, salary: 16000000 },
  { id: 'FA-WR-02', name: 'Keyshawn "Me-shawn" Johnson', position: 'WR', overall: 81, stats: { speed: 88, catching: 92 }, salary: 9000000 },
  { id: 'FA-WR-03', name: 'Qadry "The Missile" Ismail', position: 'WR', overall: 77, stats: { speed: 94, catching: 82 }, salary: 4500000 },

  // Defense
  { id: 'FA-DL-01', name: 'Warren "The Terror" Sapp', position: 'DL', overall: 89, stats: { strength: 96, tackling: 92 }, salary: 20000000 },
  { id: 'FA-LB-01', name: 'Ray "The Animal" Lewis', position: 'LB', overall: 86, stats: { tackling: 98, strength: 88, vision: 90 }, salary: 17000000 },
  { id: 'FA-CB-01', name: 'Aeneas "The Island" Williams', position: 'CB', overall: 83, stats: { speed: 94, agility: 92, vision: 88 }, salary: 12000000 },
  { id: 'FA-S-01', name: 'Ronnie "The Rocket" Lott', position: 'S', overall: 87, stats: { tackling: 95, vision: 92, speed: 89 }, salary: 18000000 },

  // Offensive Line
  { id: 'FA-OL-01', name: 'Jonathan "The Titan" Ogden', position: 'OL', overall: 90, stats: { strength: 99, toughness: 95 }, salary: 22000000 },
  { id: 'FA-OL-02', name: 'Willie "The Wall" Roaf', position: 'OL', overall: 82, stats: { strength: 94, toughness: 90 }, salary: 10000000 },
];