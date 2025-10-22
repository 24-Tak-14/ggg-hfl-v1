import React from 'react';
import { FANTASY_CONTESTS, FANTASY_REWARDS } from '../src/core/data/FantasyData';
import { Trophy, ShoppingCart, Check, AlertTriangle } from 'lucide-react';

const FantasyView: React.FC = () => {
  // Cosmetic function to simulate joining a contest.
  const handleJoinContest = (contestName: string) => {
    alert(`You have joined the "${contestName}" contest! Good luck!`);
  };

  // Cosmetic function to simulate purchasing a reward.
  const handlePurchaseReward = (rewardName: string) => {
    alert(`You have purchased: ${rewardName}!`);
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">Daily Fantasy</h1>
      <p className="text-stone-400 mb-6">Compete in daily contests and redeem your winnings for exclusive rewards.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contests Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-stone-700 pb-2 flex items-center gap-2">
            <Trophy className="text-amber-400" /> Available Contests
          </h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {FANTASY_CONTESTS.map(contest => (
              <div key={contest.id} className="bg-stone-800/60 p-4 rounded-lg border border-stone-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{contest.name}</h3>
                    <p className="text-sm text-stone-400">Prize Pool: <span className="text-green-400 font-semibold">${contest.prizePool.toLocaleString()}</span></p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    contest.status === 'Live' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {contest.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold text-stone-200">Entry: <span className="text-amber-400">${contest.entryFee}</span></p>
                  <button
                    onClick={() => handleJoinContest(contest.name)}
                    disabled={contest.status !== 'Upcoming'}
                    className="bg-amber-400 text-stone-900 font-bold py-2 px-5 rounded-md hover:bg-amber-300 transition-colors disabled:bg-stone-600 disabled:text-stone-400 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {contest.status === 'Upcoming' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {contest.status === 'Upcoming' ? 'Join' : 'Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Store Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-stone-700 pb-2 flex items-center gap-2">
            <ShoppingCart className="text-amber-400" /> Rewards Store
          </h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {FANTASY_REWARDS.map(reward => (
              <div key={reward.id} className="bg-stone-800/60 p-4 rounded-lg border border-stone-700">
                <h3 className="text-lg font-bold text-white">{reward.name}</h3>
                <p className="text-sm text-stone-400 mt-1 mb-3 h-10">{reward.description}</p>
                 <div className="flex justify-between items-center">
                  <p className="font-bold text-stone-200">Cost: <span className="text-cyan-400">{reward.cost.toLocaleString()} Points</span></p>
                  <button onClick={() => handlePurchaseReward(reward.name)} className="bg-stone-700 text-white font-semibold py-2 px-5 rounded-md hover:bg-stone-600 transition-colors">
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyView;