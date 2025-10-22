import React, { useState, useMemo } from 'react';
import { DRAFT_PROSPECTS } from '../src/core/data/DraftData';
import { Position } from '../types';

// Get a unique list of all available positions from the draft prospects data.
const POSITIONS = [...new Set(DRAFT_PROSPECTS.map(p => p.position))] as Position[];

type SortKey = 'overall' | 'potential';

const DraftView: React.FC = () => {
    const [positionFilter, setPositionFilter] = useState<Position | 'ALL'>('ALL');
    const [sortKey, setSortKey] = useState<SortKey>('overall');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Memoize the filtered and sorted prospects to optimize performance.
    const filteredAndSortedProspects = useMemo(() => {
        let prospects = DRAFT_PROSPECTS;

        // Apply position filter
        if (positionFilter !== 'ALL') {
            prospects = prospects.filter(p => p.position === positionFilter);
        }

        // Apply sorting based on the selected key and order
        prospects.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (sortOrder === 'asc') {
                return valA - valB;
            }
            return valB - valA;
        });

        return prospects;
    }, [positionFilter, sortKey, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Draft Prospects</h1>
            <p className="text-stone-400 mb-6">Scout the next generation of HFL talent.</p>

            {/* Filter and Sort Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center bg-stone-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <label htmlFor="position-filter" className="font-semibold text-sm">Position:</label>
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
                {/* Sort Key Selection */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Sort by:</span>
                    <button
                        onClick={() => setSortKey('overall')}
                        className={`font-semibold py-1.5 px-4 rounded-md transition-colors ${sortKey === 'overall' ? 'bg-amber-400 text-stone-900' : 'bg-stone-700 text-white hover:bg-stone-600'}`}
                    >
                        Overall
                    </button>
                    <button
                        onClick={() => setSortKey('potential')}
                        className={`font-semibold py-1.5 px-4 rounded-md transition-colors ${sortKey === 'potential' ? 'bg-amber-400 text-stone-900' : 'bg-stone-700 text-white hover:bg-stone-600'}`}
                    >
                        Potential
                    </button>
                </div>
                {/* Sort Order Toggle */}
                <button
                    onClick={toggleSortOrder}
                    className="bg-stone-700 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-stone-600 transition-colors text-sm"
                >
                    Order: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                </button>
            </div>

            {/* Prospects Table */}
            <div className="overflow-x-auto bg-stone-800/50 rounded-lg ring-1 ring-stone-700">
                <table className="min-w-full divide-y divide-stone-700">
                    <thead className="bg-stone-900/60">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-stone-300 uppercase tracking-wider">Position</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-stone-300 uppercase tracking-wider">Overall</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-stone-300 uppercase tracking-wider">Potential</th>
                        </tr>
                    </thead>
                    <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {filteredAndSortedProspects.map((prospect) => (
                            <tr key={prospect.id} className="hover:bg-stone-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{prospect.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-stone-300 font-mono">{prospect.position}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${sortKey === 'overall' ? 'text-amber-400' : 'text-stone-300'}`}>{prospect.overall}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-bold ${sortKey === 'potential' ? 'text-cyan-400' : 'text-stone-300'}`}>{prospect.potential}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DraftView;