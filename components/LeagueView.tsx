import React, { useState, useMemo } from 'react';
import { TEAMS } from '../src/core/data/TeamData';
import { Team } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'name' | 'wins' | 'losses' | 'ties' | 'mega_chalices';
type SortDirection = 'ascending' | 'descending';

interface LeagueViewProps {
    onSelectTeam: (teamId: string) => void;
}

// This component provides a sortable table displaying all the teams in the league.
const LeagueView: React.FC<LeagueViewProps> = ({ onSelectTeam }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'wins', direction: 'descending' });

    // Memoize the sorted teams array to avoid re-sorting on every render.
    const sortedTeams = useMemo(() => {
        let sortableTeams = [...TEAMS];
        sortableTeams.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            // Add a secondary sort by name to ensure stable sorting
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        return sortableTeams;
    }, [sortConfig]);

    // Handles the click on a column header to change the sorting configuration.
    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Renders the sort indicator icon (up or down arrow).
    const getSortIndicator = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') {
            return <ChevronUp className="w-4 h-4 inline ml-1" />;
        }
        return <ChevronDown className="w-4 h-4 inline ml-1" />;
    };

    const tableHeaders: { key: SortKey, label: string, numeric: boolean }[] = [
        { key: 'name', label: 'Team', numeric: false },
        { key: 'wins', label: 'W', numeric: true },
        { key: 'losses', label: 'L', numeric: true },
        { key: 'ties', label: 'T', numeric: true },
        { key: 'mega_chalices', label: '🏆', numeric: true },
    ];

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">League Standings</h1>
            <p className="text-stone-400 mb-6">View the records of all 36 teams across the Heart Football League.</p>
            
            <div className="overflow-x-auto bg-stone-800/50 rounded-lg ring-1 ring-stone-700">
                <table className="min-w-full divide-y divide-stone-700">
                    <thead className="bg-stone-900/60">
                        <tr>
                            {tableHeaders.map(({ key, label, numeric }) => (
                                <th 
                                    key={key} 
                                    scope="col" 
                                    className={`px-6 py-3 text-xs font-medium text-stone-300 uppercase tracking-wider cursor-pointer hover:bg-stone-800 transition-colors ${numeric ? 'text-right' : 'text-left'}`}
                                    onClick={() => requestSort(key)}
                                >
                                    {label} {getSortIndicator(key)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {sortedTeams.map((team) => (
                            <tr key={team.id} onClick={() => onSelectTeam(team.id)} className="hover:bg-stone-700/50 transition-colors cursor-pointer">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-white">{team.name}</div>
                                    <div className="text-xs text-stone-400">{team.city}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-stone-300 font-mono">{team.wins}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-stone-300 font-mono">{team.losses}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-stone-300 font-mono">{team.ties}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-stone-300 font-mono">{team.mega_chalices}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeagueView;