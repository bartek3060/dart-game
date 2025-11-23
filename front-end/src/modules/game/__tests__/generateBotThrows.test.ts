import { generateBotThrow } from '../generateBotThrows';
import type { BotDifficulty } from '@/contexts/BotGameContext/botGameTypes';

describe('generateBotThrow', () => {
    describe('Score Validation', () => {
        it('should never return a score greater than 180', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const currentScores = [501, 300, 150, 100, 50];

            difficulties.forEach((difficulty) => {
                currentScores.forEach((currentScore) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(currentScore, difficulty);
                        expect(throw_).toBeLessThanOrEqual(180);
                    }
                });
            });
        });

        it('should never return a negative score', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const currentScores = [501, 300, 150, 100, 50, 10, 2];

            difficulties.forEach((difficulty) => {
                currentScores.forEach((currentScore) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(currentScore, difficulty);
                        expect(throw_).toBeGreaterThanOrEqual(0);
                    }
                });
            });
        });

        it('should never cause a bust (score goes below 0)', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const currentScores = [501, 300, 150, 100, 50, 10, 2];

            difficulties.forEach((difficulty) => {
                currentScores.forEach((currentScore) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(currentScore, difficulty);
                        expect(throw_).toBeLessThanOrEqual(currentScore);
                    }
                });
            });
        });

        it('should never leave exactly 1 point remaining', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const currentScores = [501, 300, 150, 100, 50, 10, 2];

            difficulties.forEach((difficulty) => {
                currentScores.forEach((currentScore) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(currentScore, difficulty);
                        const remainingScore = currentScore - throw_;
                        expect(remainingScore).not.toBe(1);
                    }
                });
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle score of 2 safely', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];

            difficulties.forEach((difficulty) => {
                for (let i = 0; i < 50; i++) {
                    const throw_ = generateBotThrow(2, difficulty);
                    expect(throw_).toBeGreaterThanOrEqual(0);
                    expect(throw_).toBeLessThanOrEqual(2);
                    expect(2 - throw_).not.toBe(1);
                }
            });
        });

        it('should handle very low scores (3-10)', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const lowScores = [3, 5, 7, 10];

            difficulties.forEach((difficulty) => {
                lowScores.forEach((score) => {
                    for (let i = 0; i < 50; i++) {
                        const throw_ = generateBotThrow(score, difficulty);
                        expect(throw_).toBeGreaterThanOrEqual(0);
                        expect(throw_).toBeLessThanOrEqual(score);
                        expect(score - throw_).not.toBe(1);
                    }
                });
            });
        });

        it('should handle high scores (400-501)', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const highScores = [400, 450, 501];

            difficulties.forEach((difficulty) => {
                highScores.forEach((score) => {
                    for (let i = 0; i < 50; i++) {
                        const throw_ = generateBotThrow(score, difficulty);
                        expect(throw_).toBeGreaterThanOrEqual(0);
                        expect(throw_).toBeLessThanOrEqual(180);
                        expect(score - throw_).not.toBe(1);
                    }
                });
            });
        });

        it('should handle finish range scores (1-180)', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const finishScores = [50, 100, 150, 180];

            difficulties.forEach((difficulty) => {
                finishScores.forEach((score) => {
                    for (let i = 0; i < 50; i++) {
                        const throw_ = generateBotThrow(score, difficulty);
                        expect(throw_).toBeGreaterThanOrEqual(0);
                        expect(throw_).toBeLessThanOrEqual(score);
                        expect(score - throw_).not.toBe(1);
                    }
                });
            });
        });
    });

    describe('Difficulty Levels', () => {
        describe('Easy Difficulty', () => {
            it('should generate scores in expected range for high scores', () => {
                const currentScore = 501;
                const throws: number[] = [];

                for (let i = 0; i < 200; i++) {
                    throws.push(generateBotThrow(currentScore, 'easy'));
                }

                const avgThrow = throws.reduce((a, b) => a + b, 0) / throws.length;
                // Easy bots with realistic physics hit the board more often, so avg is higher than random 0-40
                // But still low accuracy on T20.
                // S20 * 3 = 60. Random hits around board.
                // Let's say < 80 is reasonable for "Easy" (mostly singles)
                expect(avgThrow).toBeLessThan(80);
            });

            it('should occasionally finish when score is finishable', () => {
                const finishableScore = 40; // D20
                let finishCount = 0;

                for (let i = 0; i < 1000; i++) {
                    const throw_ = generateBotThrow(finishableScore, 'easy');
                    if (throw_ === finishableScore) {
                        finishCount++;
                    }
                }

                // Easy bots should finish sometimes
                // With 3 darts to hit D20 (prob 0.15), chance is decent.
                expect(finishCount).toBeGreaterThan(0);
                // 1000 trials. 0.15 prob per dart.
                // It's actually quite high if they get 3 darts at it.
                // Let's just check it's not 0.
                expect(finishCount).toBeLessThan(600);
            });
        });

        describe('Medium Difficulty', () => {
            it('should generate higher scores than easy difficulty', () => {
                const currentScore = 501;
                const easyThrows: number[] = [];
                const mediumThrows: number[] = [];

                for (let i = 0; i < 200; i++) {
                    easyThrows.push(generateBotThrow(currentScore, 'easy'));
                    mediumThrows.push(generateBotThrow(currentScore, 'medium'));
                }

                const avgEasy = easyThrows.reduce((a, b) => a + b, 0) / easyThrows.length;
                const avgMedium = mediumThrows.reduce((a, b) => a + b, 0) / mediumThrows.length;

                expect(avgMedium).toBeGreaterThan(avgEasy);
            });

            it('should finish more often than easy difficulty', () => {
                const finishableScore = 40;
                let finishCount = 0;

                for (let i = 0; i < 1000; i++) {
                    const throw_ = generateBotThrow(finishableScore, 'medium');
                    if (throw_ === finishableScore) {
                        finishCount++;
                    }
                }

                expect(finishCount).toBeGreaterThan(100);
                expect(finishCount).toBeLessThan(800);
            });
        });

        describe('Hard Difficulty', () => {
            it('should generate higher scores than medium difficulty', () => {
                const currentScore = 501;
                const mediumThrows: number[] = [];
                const hardThrows: number[] = [];

                for (let i = 0; i < 200; i++) {
                    mediumThrows.push(generateBotThrow(currentScore, 'medium'));
                    hardThrows.push(generateBotThrow(currentScore, 'hard'));
                }

                const avgMedium = mediumThrows.reduce((a, b) => a + b, 0) / mediumThrows.length;
                const avgHard = hardThrows.reduce((a, b) => a + b, 0) / hardThrows.length;

                expect(avgHard).toBeGreaterThan(avgMedium);
            });

            it('should finish more often than medium difficulty', () => {
                const finishableScore = 40;
                let finishCount = 0;

                for (let i = 0; i < 1000; i++) {
                    const throw_ = generateBotThrow(finishableScore, 'hard');
                    if (throw_ === finishableScore) {
                        finishCount++;
                    }
                }

                expect(finishCount).toBeGreaterThan(200);
            });
        });

        describe('Expert Difficulty', () => {
            it('should generate the highest average scores', () => {
                const currentScore = 501;
                const hardThrows: number[] = [];
                const expertThrows: number[] = [];

                for (let i = 0; i < 200; i++) {
                    hardThrows.push(generateBotThrow(currentScore, 'hard'));
                    expertThrows.push(generateBotThrow(currentScore, 'expert'));
                }

                const avgHard = hardThrows.reduce((a, b) => a + b, 0) / hardThrows.length;
                const avgExpert = expertThrows.reduce((a, b) => a + b, 0) / expertThrows.length;

                expect(avgExpert).toBeGreaterThan(avgHard);
            });

            it('should finish most often among all difficulties', () => {
                const finishableScore = 40;
                let finishCount = 0;

                for (let i = 0; i < 1000; i++) {
                    const throw_ = generateBotThrow(finishableScore, 'expert');
                    if (throw_ === finishableScore) {
                        finishCount++;
                    }
                }

                expect(finishCount).toBeGreaterThan(300);
            });

            it('should generate scores in expected range for high scores', () => {
                const currentScore = 501;
                const throws: number[] = [];

                for (let i = 0; i < 200; i++) {
                    throws.push(generateBotThrow(currentScore, 'expert'));
                }

                const avgThrow = throws.reduce((a, b) => a + b, 0) / throws.length;
                // Expert bots should have higher average throws (mostly T20s)
                expect(avgThrow).toBeGreaterThan(80);
            });
        });
    });

    describe('Winning Scenarios', () => {
        it('should be able to finish the game for all difficulties', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            // Use realistic finish scores. 180 is possible but very rare for easy bots to hit in one turn.
            const finishableScores = [32, 40, 50];

            difficulties.forEach((difficulty) => {
                finishableScores.forEach((score) => {
                    let canFinish = false;

                    for (let i = 0; i < 500; i++) {
                        const throw_ = generateBotThrow(score, difficulty);
                        if (throw_ === score) {
                            canFinish = true;
                            break;
                        }
                    }

                    expect(canFinish).toBe(true);
                });
            });
        });

        it('should never finish by leaving exactly 1 point', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const testScores = [51, 101, 151, 181];

            difficulties.forEach((difficulty) => {
                testScores.forEach((score) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(score, difficulty);
                        expect(score - throw_).not.toBe(1);
                    }
                });
            });
        });
    });

    describe('Consistency', () => {
        it('should return valid throws consistently', () => {
            const difficulties: BotDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
            const testScores = [501, 300, 150, 100, 50, 20, 10, 5, 2];

            difficulties.forEach((difficulty) => {
                testScores.forEach((score) => {
                    for (let i = 0; i < 100; i++) {
                        const throw_ = generateBotThrow(score, difficulty);

                        // All throws should be valid
                        expect(throw_).toBeGreaterThanOrEqual(0);
                        expect(throw_).toBeLessThanOrEqual(180);
                        expect(throw_).toBeLessThanOrEqual(score);
                        expect(score - throw_).not.toBe(1);
                    }
                });
            });
        });
    });
});
