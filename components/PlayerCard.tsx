import React from 'react';
import { Player, Rarity } from '../types';

// A custom hook to determine the card's color scheme based on its rarity tier.
const useRarityColor = (rarity: Rarity): string => {
  switch (rarity) {
    case 'ZORI': return 'from-indigo-500 to-purple-600';
    case 'GLAMOURBEAN': return 'from-gray-800 to-black';
    case 'GLAMOURSHINE': return 'from-slate-300 to-blue-400';
    case 'UNOBMAHNEUM': return 'from-red-500 to-orange-500';
    case 'JAYMOND': return 'from-cyan-400 to-blue-500';
    case 'GOLD': return 'from-yellow-400 to-yellow-600';
    case 'SILVER': return 'from-gray-400 to-gray-500';
    case 'MARBLE': return 'from-stone-300 to-stone-500';
    case 'CLAY':
    case 'THIRSTY I':
    case 'THIRSTY II':
    case 'STRUGGLE I':
    case 'STRUGGLE II':
    default: return 'from-amber-700 to-amber-900';
  }
};

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const rarityColorClasses = useRarityColor(player.rarity);
  
  // Inline style for the holographic effect, controlled by the player's data.
  const holographicStyle = {
    '--glow-color': player.rarity === 'ZORI' ? '#a100a1' : '#ffffff',
    opacity: player.holographic_intensity,
    boxShadow: `0 0 8px var(--glow-color), 0 0 12px var(--glow-color)`
  };

  return (
    <div className="bg-stone-800/50 p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 border border-stone-700">
      <div className={`bg-gradient-to-br ${rarityColorClasses} p-4 rounded-lg relative overflow-hidden`}>
        {/* Holographic overlay effect */}
        <div className="absolute inset-0 bg-white/10" style={holographicStyle}></div>
        
        <div className="relative z-10">
            <h3 className="text-xl font-bold text-white truncate">{player.name}</h3>
            <p className="text-stone-200">{player.position} | Overall: {player.overall}</p>
            <p className="text-sm text-stone-300">Rarity: {player.rarity}</p>
            <p className="text-xs text-stone-300 italic mt-1 h-8">Will to Power: {player.shall_to_power_ability}</p>
            
            <div className="mt-3 space-y-2">
                <div>
                    <p className="text-sm font-semibold text-white">Apzu Execution: {player.apzuExecutionScore.toFixed(1)}</p>
                    <div className="bg-black/30 rounded-full h-2.5">
                        <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${player.apzuExecutionScore}%` }}></div>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">Tiama’at Chaos: {player.tiamaatChaosRating.toFixed(1)}</p>
                    <div className="bg-black/30 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${player.tiamaatChaosRating}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
