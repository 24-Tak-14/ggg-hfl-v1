import React, { useState, useEffect } from 'react';
import { Play } from '../types';

interface DiceRollerProps {
  play: Play | null;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ play }) => {
  const [dice, setDice] = useState<number[]>([]);

  // When a new play is selected, generate new random dice rolls.
  useEffect(() => {
    if (play) {
      const offenseDice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
      setDice(offenseDice);
    }
  }, [play]);

  return (
    <div className="bg-black/30 p-4 rounded-lg border border-stone-700">
      <h3 className="text-lg font-bold text-white mb-3 text-center">Dice Roll</h3>
      {dice.length > 0 ? (
        <div className="flex gap-4 justify-center">
          {dice.map((roll, idx) => (
            <div key={idx} className="bg-red-600 text-white w-14 h-14 flex items-center justify-center rounded-lg text-2xl font-bold shadow-md">
              {roll}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-400 text-center h-14 flex items-center justify-center">Select a play to roll</p>
      )}
    </div>
  );
};

export default DiceRoller;
