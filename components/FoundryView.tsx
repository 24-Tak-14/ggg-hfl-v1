import React, { useState, useMemo } from 'react';
import { BLUEPRINTS } from '../src/core/data/BlueprintData';
import { FOUNDRY_PARTS } from '../src/core/data/FoundryPartData';
import { PLAYERS } from '../src/core/data/PlayerData';
import { GameService } from '../src/core/services/GameService';
import { Player, Blueprint, FoundryPart, Rarity } from '../types';
import PlayerCard from './PlayerCard';
import { Hammer, Sparkles, X, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';

// The Foundry component, a central hub for player upgrades.
const FoundryView: React.FC = () => {
    // State to manage the user's selections and the upgrade process.
    const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [upgradedPlayer, setUpgradedPlayer] = useState<Player | null>(null);
    const [isForging, setIsForging] = useState(false);
    
    // Memoize the user's team roster to prevent unnecessary recalculations.
    // Hardcoded to team '1' for this demonstration.
    const myTeamRoster = useMemo(() => PLAYERS.filter(p => p.teamId === '1'), []);

    // Handles the selection of a blueprint from the list.
    const handleSelectBlueprint = (blueprint: Blueprint) => {
        setSelectedBlueprint(blueprint);
        setSelectedPlayer(null); // Reset player selection when blueprint changes.
        setUpgradedPlayer(null); // Clear any previous upgrade results.
    };

    // Handles the selection of a player to be upgraded.
    const handleSelectPlayer = (playerId: string) => {
        const player = myTeamRoster.find(p => p.id === playerId);
        if (player) {
            setSelectedPlayer(player);
        }
    };

    // Initiates the forging process.
    const handleForge = () => {
        if (!selectedPlayer || !selectedBlueprint) return;
        
        setIsForging(true);
        // Simulate a network request or complex calculation for the forging process.
        setTimeout(() => {
            // Use the game service to calculate the upgraded player stats.
            const newPlayer = GameService.upgradePlayer(selectedPlayer, selectedBlueprint);
            setUpgradedPlayer(newPlayer);
            setIsForging(false);
        }, 1500);
    };

    // Resets the Foundry view to its initial state, closing the results modal.
    const resetForge = () => {
        setSelectedBlueprint(null);
        setSelectedPlayer(null);
        setUpgradedPlayer(null);
    };
    
    // A helper function to retrieve details for a specific crafting part.
    const getPartDetails = (partId: string): FoundryPart | undefined => {
        return FOUNDRY_PARTS.find(p => p.id === partId);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2 flex items-center gap-3"><Hammer /> The Foundry</h1>
            <p className="text-stone-400 mb-6">Forge greatness from chaos and order. Upgrade your players with powerful blueprints.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: List of available blueprints */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-b-2 border-stone-700 pb-2">Available Blueprints</h2>
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                        {BLUEPRINTS.map(bp => (
                            <div key={bp.id} className={`p-4 rounded-lg bg-stone-800/60 border transition-all ${selectedBlueprint?.id === bp.id ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-700'}`}>
                                <h3 className="text-lg font-bold text-cyan-400">{bp.id.replace(/_/g, ' ')}</h3>
                                <p className="text-sm text-stone-300 mb-3">Output Rarity: <span className="font-semibold text-white">{bp.output.rarity}</span></p>
                                
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-stone-200 mb-1">Requirements:</h4>
                                    <ul className="text-xs space-y-1 text-stone-400">
                                        {Object.entries(bp.requirements).map(([partId, quantity]) => (
                                            <li key={partId} className="flex justify-between">
                                                <span>{getPartDetails(partId)?.name || partId}</span>
                                                {/* FIX: Explicitly cast quantity to a string to satisfy ReactNode type. */}
                                                <span>x{String(quantity)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => handleSelectBlueprint(bp)}
                                    className="w-full bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-600 transition-colors text-sm"
                                >
                                    Select Blueprint
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: The interactive crafting station */}
                <div className="bg-stone-800/50 p-6 rounded-lg ring-1 ring-stone-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Crafting Station</h2>
                    {!selectedBlueprint ? (
                        <div className="flex items-center justify-center h-full text-stone-500">
                            <p>Select a blueprint to begin.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-amber-400">{selectedBlueprint.id.replace(/_/g, ' ')}</h3>
                                <p className="text-sm text-stone-300">Prepare to upgrade a player to <span className="font-bold text-white">{selectedBlueprint.output.rarity}</span> rarity.</p>
                            </div>

                            <div>
                                <label htmlFor="player-select" className="block text-sm font-bold text-stone-300 mb-2">1. Select Player</label>
                                <select 
                                    id="player-select" 
                                    value={selectedPlayer?.id || ''} 
                                    onChange={(e) => handleSelectPlayer(e.target.value)}
                                    className="w-full bg-stone-700 text-white rounded-md py-2 px-3 border-stone-600 focus:ring-amber-400 focus:border-amber-400"
                                >
                                    <option value="" disabled>-- Choose a player to upgrade --</option>
                                    {myTeamRoster.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.position} - OVR: {p.overall})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <h4 className="block text-sm font-bold text-stone-300 mb-2">2. Materials Checklist</h4>
                                <div className="space-y-2 p-3 bg-black/20 rounded-md">
                                    {Object.entries(selectedBlueprint.requirements).map(([partId, quantity]) => (
                                        <div key={partId} className="flex items-center justify-between text-sm text-stone-300">
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                {getPartDetails(partId)?.name || partId}
                                            </span>
                                            {/* FIX: Explicitly cast quantity to a string to satisfy ReactNode type. */}
                                            <span className="font-mono">x{String(quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-stone-500 mt-1 italic">You have all the required materials.</p>
                            </div>
                            
                            <button 
                                onClick={handleForge}
                                disabled={!selectedPlayer || isForging}
                                className="w-full bg-amber-400 text-stone-900 font-bold py-3 px-6 rounded-lg transition hover:bg-amber-300 disabled:opacity-50 flex items-center justify-center text-lg"
                            >
                                {isForging ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Hammer className="w-6 h-6 mr-2" />}
                                {isForging ? 'Forging...' : 'Forge Player'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal to display the results of the player upgrade */}
            {upgradedPlayer && selectedPlayer && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
                    <div className="bg-stone-900 rounded-lg shadow-2xl max-w-4xl w-full p-6 ring-1 ring-amber-500 relative">
                        <button onClick={resetForge} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-amber-400 flex items-center justify-center gap-2"><Sparkles/> Ascension Complete!</h2>
                            <p className="text-stone-300 mt-2">{selectedPlayer.name} has been reforged!</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mt-6 text-center">
                            <div className="w-full max-w-xs mx-auto">
                                <h3 className="font-bold text-white mb-2">Before</h3>
                                <PlayerCard player={selectedPlayer} />
                            </div>
                            
                            <div className="text-amber-400 hidden md:block">
                                <ChevronRight size={48} className="w-full" />
                            </div>

                            <div className="w-full max-w-xs mx-auto">
                                <h3 className="font-bold text-white mb-2">After</h3>
                                <PlayerCard player={upgradedPlayer} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInFast {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in-fast {
        animation: fadeInFast 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);


export default FoundryView;
