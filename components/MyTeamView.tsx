import React, { useState, useMemo } from 'react';
import { PLAYERS } from '../src/core/data/PlayerData';
import { TEAMS } from '../src/core/data/TeamData';
import PlayerCard from './PlayerCard';
import { Player } from '../types';

const MyTeamView: React.FC = () => {
    // For this example, we'll hardcode the user's team. In a full app, this would be dynamic.
    const myTeamId = '1';
    const myTeam = TEAMS.find(t => t.id === myTeamId);

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Memoize the roster to prevent re-filtering and re-sorting on every render.
    const roster = useMemo(() => {
        const teamPlayers = PLAYERS.filter(p => p.teamId === myTeamId);
        teamPlayers.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.overall - b.overall;
            }
            return b.overall - a.overall;
        });
        return teamPlayers;
    }, [myTeamId, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    if (!myTeam) {
        return <div className="text-red-500">Team not found!</div>;
    }

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">My Team: {myTeam.name}</h1>
            <p className="text-stone-400 mb-6">Manage your roster and review your players' capabilities.</p>

            <div className="mb-6 flex justify-end">
                <button 
                    onClick={toggleSortOrder}
                    className="bg-stone-700 text-white font-semibold py-2 px-5 rounded-md hover:bg-stone-600 transition-colors"
                >
                    Sort by Overall: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                </button>
            </div>

            {roster.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roster.map(player => (
                        <PlayerCard key={player.id} player={player} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-stone-800/50 rounded-lg">
                    <p className="text-stone-400">This team has no players on its roster.</p>
                </div>
            )}
        </div>
    );
};

export default MyTeamView;