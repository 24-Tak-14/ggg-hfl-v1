import React, { useState, useEffect } from 'react';
import { TEAMS } from '../src/core/data/TeamData';
import { PLAYERS } from '../src/core/data/PlayerData';
import { CODEX_DATA } from '../src/core/data/codexData';
import { GameService } from '../src/core/services/GameService';
import { Team, Player, Matchup, Play, GameEvent, CodexEntry } from '../types';
import DiceRoller from './DiceRoller';
import PlayCallingUI from './PlayCallingUI';
import PlayerCard from './PlayerCard';
import { BookOpen, X } from 'lucide-react';

const GameSim: React.FC = () => {
  const [matchup, setMatchup] = useState<Matchup>({
    home: TEAMS.find(t => t.id === '1')!,
    away: TEAMS.find(t => t.id === '22')!,
    score: { home: 0, away: 0 },
    downs: 1,
    yardLine: 20
  });
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const [offensivePlayer, setOffensivePlayer] = useState<Player | null>(null);
  const [defensivePlayer, setDefensivePlayer] = useState<Player | null>(null);
  const [isCodexOpen, setIsCodexOpen] = useState(false);

  useEffect(() => {
    setOffensivePlayer(PLAYERS.find(p => p.teamId === '1' && p.position === 'QB')!);
    setDefensivePlayer(PLAYERS.find(p => p.teamId === '22' && p.position === 'RB')!);
  }, []);

  const handlePlaySelection = (play: Play) => {
    if (!offensivePlayer || !defensivePlayer) return;
    
    const { event, detailedLog } = GameService.simulatePlay(matchup, play, offensivePlayer, defensivePlayer);
    setGameLog([event.description, ...detailedLog, '---', ...gameLog.slice(0, 20)]);
    setMatchup({ ...matchup });
    setSelectedPlay(play);
  };

  const CodexModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-stone-900 rounded-lg shadow-2xl max-w-2xl w-full p-6 ring-1 ring-amber-500 relative animate-fade-in-fast">
            <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">ZORI Codex</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3">
                {CODEX_DATA.map(entry => (
                    <div key={entry.id} className="p-3 bg-stone-800/50 rounded-md">
                        <h3 className="font-bold text-white">{entry.title}</h3>
                        <p className="text-sm text-stone-400">{entry.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  if (!offensivePlayer || !defensivePlayer) {
    return <div className="text-red-500">Loading players...</div>;
  }

  return (
    <div className="bg-stone-950/70 p-4 sm:p-6 rounded-lg shadow-2xl ring-1 ring-stone-800">
      {isCodexOpen && <CodexModal onClose={() => setIsCodexOpen(false)} />}
      <header className="text-center mb-6 pb-4 border-b-2 border-stone-800">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">{matchup.home.name} vs {matchup.away.name}</h2>
            <button onClick={() => setIsCodexOpen(true)} className="flex items-center gap-2 text-sm bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                <BookOpen className="w-5 h-5" /> Codex
            </button>
        </div>
        <div className="flex justify-center items-center gap-6 text-2xl font-bold text-white mt-2">
            <span>{matchup.score.home}</span>
            <span className="text-amber-400 text-sm">SCORE</span>
            <span>{matchup.score.away}</span>
        </div>
        <div className="text-sm text-stone-400 mt-2">
            <span>Down: {matchup.downs}</span>
            <span className="mx-2">|</span>
            <span>Yard Line: {matchup.yardLine}</span>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col items-center"><PlayerCard player={offensivePlayer} /></div>
        <div className="flex flex-col gap-4"><PlayCallingUI onSelectPlay={handlePlaySelection} /><DiceRoller play={selectedPlay} /></div>
        <div className="flex flex-col items-center"><PlayerCard player={defensivePlayer} /></div>
      </div>

      <div className="mt-6 bg-black/40 p-4 rounded-lg ring-1 ring-stone-800">
        <h3 className="text-lg font-bold text-white mb-2">Play-by-Play Log</h3>
        <div className="space-y-1.5 text-sm font-mono h-48 overflow-y-auto pr-2">
            {gameLog.map((entry, idx) => (
              <p key={idx} className={`whitespace-pre-wrap ${entry.startsWith('---') ? 'text-stone-600' : entry.startsWith('Checkpoint') ? 'text-stone-400' : 'text-stone-200'} animate-fade-in-fast`}>{entry}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInFast {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in-fast {
        animation: fadeInFast 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);


export default GameSim;
