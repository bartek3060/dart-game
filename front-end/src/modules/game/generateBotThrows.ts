import type { BotDifficulty } from "../../contexts/BotGameContext/botGameTypes";

interface BotStats {
  accuracy: number;
  neighborHitRate: number;
  trebleAccuracy: number;
  doubleAccuracy: number;
}

interface DartTarget {
  value: number;
  multiplier: 1 | 2 | 3;
}

const DIFFICULTY_STATS: Record<BotDifficulty, BotStats> = {
  easy: {
    accuracy: 0.15,
    neighborHitRate: 0.8,
    trebleAccuracy: 0.1,
    doubleAccuracy: 0.1,
  },
  medium: {
    accuracy: 0.25,
    neighborHitRate: 0.6,
    trebleAccuracy: 0.2,
    doubleAccuracy: 0.2,
  },
  hard: {
    accuracy: 0.4,
    neighborHitRate: 0.3,
    trebleAccuracy: 0.25,
    doubleAccuracy: 0.25,
  },
  expert: {
    accuracy: 0.5,
    neighborHitRate: 0.2,
    trebleAccuracy: 0.3,
    doubleAccuracy: 0.3,
  },
};

const getBestTarget = (remainingScore: number): DartTarget => {
  // Can finish in this shot
  if (remainingScore <= 40 && remainingScore % 2 === 0 && remainingScore > 0) {
    return { value: remainingScore / 2, multiplier: 2 };
  }
  if (remainingScore === 50) {
    return { value: 25, multiplier: 2 };
  }

  // Try to get the biggest value when score is over 60 
  if (remainingScore > 60) {
    return { value: 20, multiplier: 3 };
  }


  // Cannot end in this shot, trying to leave double 16 (32) or double 20 (40) 
  if (remainingScore > 32) {
    const diff = remainingScore - 32;
    if (diff <= 20) {
      return { value: diff, multiplier: 1 };
    }
    if (remainingScore - 40 <= 20 && remainingScore - 40 > 0) {
      return { value: remainingScore - 40, multiplier: 1 };
    }
  }

  // If we are really low (e.g. < 32) and odd
  if (remainingScore <= 32) {
    if (remainingScore % 2 !== 0) {
      return { value: 1, multiplier: 1 };
    }
  }

  return { value: 20, multiplier: 1 };
};

const BOARD_NEIGHBORS: Record<number, number[]> = {
  1: [20, 18],
  2: [15, 17],
  3: [17, 19],
  4: [18, 13],
  5: [12, 20],
  6: [13, 10],
  7: [19, 16],
  8: [16, 11],
  9: [14, 12],
  10: [6, 15],
  11: [8, 14],
  12: [9, 5],
  13: [4, 6],
  14: [11, 9],
  15: [10, 2],
  16: [7, 8],
  17: [2, 3],
  18: [1, 4],
  19: [3, 7],
  20: [5, 1],
  25: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Bull neighbors are everything
};

const simulateThrow = (target: DartTarget, stats: BotStats): number => {
  const roll = Math.random();

  // 1. Hit Target
  let hitProbability = stats.accuracy;
  if (target.multiplier === 3) hitProbability = stats.trebleAccuracy;
  if (target.multiplier === 2) hitProbability = stats.doubleAccuracy;

  if (roll < hitProbability) {
    return target.value * target.multiplier;
  }

  // 2. Miss logic
  // neighborHitRate is probability of hitting a neighbor (bad miss) given we missed the target.
  // So (1 - neighborHitRate) is probability of hitting the single of the same number (good miss).

  const missRoll = Math.random();
  if (missRoll > stats.neighborHitRate) {
    // Hit single of the same number (Good miss)
    return target.value;
  } else {
    // Hit a neighbor (Bad miss)
    const neighbors = BOARD_NEIGHBORS[target.value];
    if (neighbors) {
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      return randomNeighbor;
    }
    // Fallback for unknown targets
    return Math.floor(Math.random() * 20) + 1;
  }
};

export const generateBotThrow = (
  currentScore: number,
  difficulty: BotDifficulty
): number => {
  const stats = DIFFICULTY_STATS[difficulty];
  let turnScore = 0;
  let tempScore = currentScore;

  // Simulate 3 darts
  for (let i = 0; i < 3; i++) {
    // Check if already busted or won (though won should return immediately)
    if (tempScore <= 1 && tempScore !== 0) break; // 1 is bust, 0 is done
    if (tempScore === 0) break;

    const target = getBestTarget(tempScore);
    const throwScore = simulateThrow(target, stats);

    // Check for bust on this dart
    if (tempScore - throwScore < 0 || tempScore - throwScore === 1) {
      // Bust! Turn score is 0.
      return 0;
    }

    if (tempScore - throwScore === 0) {
      turnScore += throwScore;
      return turnScore;
    }

    turnScore += throwScore;
    tempScore -= throwScore;
  }

  return turnScore;
};