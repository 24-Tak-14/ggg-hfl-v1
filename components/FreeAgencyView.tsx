import React, { useState, useMemo } from 'react';
import { FREE_AGENTS } from '../src/core/data/FreeAgencyData';
import { FreeAgent, Position } from '../types';
import { UserPlus, ChevronUp, ChevronDown } from 'lucide-react';

// Get a unique list of all available positions from the free agents data.
const POSITIONS = [...new Set(FREE_AGENTS.map(p => p.position))] as Position[];
type SortKey = 'overall' | 'salary';

const FreeAgencyView: React.FC = () => {
    const [positionFilter, setPositionFilter] = useState<Position | 'ALL'>('ALL');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'overall', direction: 'desc' });

    // Memoize the filtered and sorted free agents to optimize performance.
    const filteredAndSortedAgents = useMemo(() => {
        let agents = FREE_AGENTS;

        if (positionFilter !== 'ALL') {
            agents = agents.filter(a => a.position === positionFilter);
        }

        agents.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (sortConfig.direction === 'asc') {
                return valA - valB;
            }
            return valB - valA;
        });

        return agents;
    }, [positionFilter, sortConfig]);

    // Handles column header clicks for sorting.
    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Renders the sort indicator icon.
    const getSortIndicator = (key: SortKey) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4 inline ml-1" /> : <ChevronUp className="w-4 h-4 inline ml-1" />;
    };

    // A cosmetic function to simulate signing a player.
    const handleSignPlayer = (agent: FreeAgent) => {
        alert(`Congratulations!\n\nYou have signed ${agent.name} (${agent.position}) to a contract worth $${agent.salary.toLocaleString()}/year.`);
    };

    const tableHeaders: { key: SortKey | 'name', label: string }[] = [
        { key: 'name', label: 'Name' },
        { key: 'overall', label: 'Overall' },
        { key: 'salary', label: 'Asking Salary' },
    ];

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Free Agency</h1>
            <p className="text-stone-400 mb-6">Scout the open market and sign the missing piece for your roster.</p>

            {/* Filter Controls */}
            <div className="mb-6 flex items-center gap-4 bg-stone-800/50 p-4 rounded-lg">
                <label htmlFor="position-filter" className="font-semibold text-sm">Filter by Position:</label>
                <select
                    id="position-filter"
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value as Position | 'ALL')}
                    className="bg-stone-700 text-white rounded-md py-1.5 px-3 border-stone-600 focus:ring-amber-400 focus:border-amber-400"
                >
                    <option value="ALL">All Positions</option>
                    {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
            </div>

            {/* Free Agents Table */}
            <div className="overflow-x-auto bg-stone-800/50 rounded-lg ring-1 ring-stone-700">
                <table className="min-w-full divide-y divide-stone-700">
                    <thead className="bg-stone-900/60">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-stone-300 uppercase tracking-wider">Position</th>
                            <th onClick={() => requestSort('overall')} className="px-6 py-3 text-center text-xs font-medium text-stone-300 uppercase tracking-wider cursor-pointer">Overall {getSortIndicator('overall')}</th>
                            <th onClick={() => requestSort('salary')} className="px-6 py-3 text-right text-xs font-medium text-stone-300 uppercase tracking-wider cursor-pointer">Salary {getSortIndicator('salary')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-stone-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {filteredAndSortedAgents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-stone-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{agent.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-stone-300 font-mono">{agent.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-amber-400">{agent.overall}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-stone-300 font-mono">${agent.salary.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button onClick={() => handleSignPlayer(agent)} className="bg-green-600/80 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-green-500 transition-colors flex items-center gap-1.5 ml-auto">
                                        <UserPlus className="w-4 h-4" />
                                        Sign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FreeAgencyView;