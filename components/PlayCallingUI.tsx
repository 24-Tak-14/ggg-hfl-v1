import React from 'react';
import { Play } from '../types';

interface PlayCallingUIProps {
  onSelectPlay: (play: Play) => void;
}

// Defines the available plays for the user.
const PLAYS: Play[] = [
  { id: 'P1', type: 'Run', outcome: 'Success', effect: 'Gain 3-7 yards', yardage: 5 },
  { id: 'P2', type: 'Pass', outcome: 'Success', effect: 'Gain 5-15 yards', yardage: 10 },
  { id: 'P3', type: 'Special', outcome: 'Chaos', effect: 'Unpredictable outcome', yardage: 0 }
];

const PlayCallingUI: React.FC<PlayCallingUIProps> = ({ onSelectPlay }) => {
  return (
    <div className="bg-black/30 p-4 rounded-lg border border-stone-700">
      <h3 className="text-lg font-bold text-white mb-3 text-center">Select Play</h3>
      <div className="grid grid-cols-1 gap-3">
        {PLAYS.map(play => (
          <button
            key={play.id}
            className="bg-stone-700 text-white px-4 py-3 rounded-lg hover:bg-stone-600 transition-colors duration-200 text-left"
            onClick={() => onSelectPlay(play)}
          >
            <p className="font-bold">{play.type}</p>
            <p className="text-xs text-stone-400">{play.effect}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayCallingUI;
