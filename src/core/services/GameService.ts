import { Team, Player, Matchup, Play, GameEvent, Blueprint } from '../../types';

export class GameService {
  /**
   * Rolls a specified number of 6-sided dice.
   * @param count The number of dice to roll.
   * @returns An array of numbers representing the dice rolls.
   */
  private static rollDice(count: number): number[] {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
  }

  /**
   * Simulates a single play, resolving it based on a multi-checkpoint dice-rolling mechanic.
   * This captures the "Enuma Elish" feel of a prolonged struggle rather than a single event.
   * @returns An object containing the final GameEvent and a detailed log of the play's checkpoints.
   */
  static simulatePlay(matchup: Matchup, play: Play, offensePlayer: Player, defensePlayer: Player): { event: GameEvent, detailedLog: string[] } {
    const checkpoints = 3; // A play is resolved over 3 mini-contests
    let offenseWins = 0;
    const detailedLog: string[] = [];

    for (let i = 1; i <= checkpoints; i++) {
        const offenseRolls = this.rollDice(3);
        const defenseRolls = this.rollDice(2);

        const apzuBonus = offensePlayer.apzuExecutionScore / 10; // Scaled bonus
        const tiamaatBonus = offensePlayer.tiamaatChaosRating / 20; // Chaos adds unpredictability
        const defenseBonus = defensePlayer.apzuExecutionScore / 10;

        const offenseScore = Math.max(...offenseRolls) + apzuBonus + (Math.random() * tiamaatBonus);
        const defenseScore = Math.max(...defenseRolls) + defenseBonus;

        if (offenseScore > defenseScore) {
            offenseWins++;
            detailedLog.push(`Checkpoint ${i}: Offense wins! (Score: ${offenseScore.toFixed(1)} vs ${defenseScore.toFixed(1)})`);
        } else {
            detailedLog.push(`Checkpoint ${i}: Defense holds! (Score: ${offenseScore.toFixed(1)} vs ${defenseScore.toFixed(1)})`);
        }
    }

    let yardage = 0;
    let outcome: Play['outcome'] = 'Failure';
    const finalMessage: string = `Final Result: Offense won ${offenseWins}/${checkpoints} checkpoints.`;
    detailedLog.push(finalMessage);

    if (offenseWins > checkpoints / 2) { // Offense wins the majority of checkpoints
        outcome = offensePlayer.tiamaatChaosRating > 60 ? 'Chaos' : 'Success';
        const baseYardage = 5 + (offenseWins * 5);
        const chaosYardage = outcome === 'Chaos' ? Math.floor(Math.random() * 20) - 5 : 0;
        yardage = baseYardage + chaosYardage;
    } else { // Defense wins
        yardage = Math.floor(Math.random() * -5); // Loss of yards
    }
    yardage = Math.round(yardage);

    // Update game state
    matchup.downs++;
    matchup.yardLine += yardage;

    if (matchup.yardLine >= 100) {
      matchup.score.home = matchup.home.id === offensePlayer.teamId ? matchup.score.home + 6 : matchup.score.home;
      matchup.score.away = matchup.away.id === offensePlayer.teamId ? matchup.score.away + 6 : matchup.score.away;
      detailedLog.push("TOUCHDOWN!");
      matchup.yardLine = 20;
      matchup.downs = 1;
    } else if (matchup.downs > 4) {
      detailedLog.push("Turnover on downs!");
      matchup.yardLine = 100 - matchup.yardLine;
      matchup.downs = 1;
    }

    matchup.yardLine = Math.max(0, Math.min(100, matchup.yardLine));

    const event: GameEvent = {
      time: new Date().toISOString(),
      teamId: offensePlayer.teamId,
      playerId: offensePlayer.id,
      description: `${offensePlayer.name} ${play.type.toLowerCase()}s for ${yardage} yards. Outcome: ${outcome}.`
    };

    return { event, detailedLog };
  }

  /**
   * Upgrades a player's stats based on a blueprint.
   */
  static upgradePlayer(player: Player, blueprint: Blueprint): Player {
    const newStats = { ...player.stats };
    const multiplier = blueprint.stat_boosts.All_Base_Stats_Multiplier;

    if (multiplier) {
        Object.keys(newStats).forEach(statKey => {
            if (typeof newStats[statKey] === 'number') {
                newStats[statKey] = Math.min(99, Math.round(newStats[statKey] * multiplier));
            }
        });
    }
    
    return {
      ...player,
      rarity: blueprint.output.rarity,
      stats: newStats,
      overall: Math.min(99, Math.round(player.overall * (multiplier || 1)) + 5),
      apzuExecutionScore: Math.min(100, player.apzuExecutionScore + (blueprint.stat_boosts.Apzu_Execution_Min || 0)),
      tiamaatChaosRating: Math.min(100, player.tiamaatChaosRating + (blueprint.stat_boosts.Tiamaat_Chaos_Max || 0))
    };
  }
}
