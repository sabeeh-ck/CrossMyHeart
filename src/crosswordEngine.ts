export interface CrosswordItem {
    clue: string;
    answer: string;
    number?: number;
}

export interface PlacedWord {
    word: string;
    clue: string;
    startX: number;
    startY: number;
    orientation: "across" | "down";
    number?: number;
}

export function generateLayout(items: CrosswordItem[]): PlacedWord[] {
    if (items.length === 0) return [];

    const sortedItems = [...items];

    const placedWords: PlacedWord[] = [];
    const isolatedItems: CrosswordItem[] = [];

    const getCell = (grid: Map<string, string>, x: number, y: number) =>
        grid.get(`${x},${y}`);

    const testPlacement = (
        word: string,
        startX: number,
        startY: number,
        orientation: "across" | "down",
        grid: Map<string, string>,
    ): { isValid: boolean; intersections: number; collision: boolean } => {
        let intersections = 0;
        let collision = false;
        let sharedCells = 0;

        for (let i = 0; i < word.length; i++) {
            const x = orientation === "across" ? startX + i : startX;
            const y = orientation === "down" ? startY + i : startY;
            const existingChar = getCell(grid, x, y);

            if (existingChar) {
                if (existingChar === word[i]) {
                    intersections++;
                    sharedCells++;
                } else {
                    collision = true; // Letter mismatch
                    break;
                }
            } else {
                const orthogonalNeighbors = [
                    { x: x + 1, y },
                    { x: x - 1, y },
                    { x, y: y + 1 },
                    { x, y: y - 1 },
                ];

                for (const n of orthogonalNeighbors) {
                    const isOwnWord =
                        (orientation === "across" &&
                            n.y === startY &&
                            n.x >= startX &&
                            n.x < startX + word.length) ||
                        (orientation === "down" &&
                            n.x === startX &&
                            n.y >= startY &&
                            n.y < startY + word.length);
                    if (!isOwnWord && getCell(grid, n.x, n.y)) {
                    }
                }
            }
        }

        const isValid =
            !collision && (placedWords.length === 0 || intersections > 0);
        return { isValid, intersections: sharedCells, collision };
    };

    // Convert placed words to a fast coordinate map for lookup
    const buildGridMap = (words: PlacedWord[]) => {
        const map = new Map<string, string>();
        words.forEach((pw) => {
            for (let i = 0; i < pw.word.length; i++) {
                const x =
                    pw.orientation === "across" ? pw.startX + i : pw.startX;
                const y = pw.orientation === "down" ? pw.startY + i : pw.startY;
                map.set(`${x},${y}`, pw.word[i]);
            }
        });
        return map;
    };

    // --- Place First Word ---
    const first = sortedItems[0];
    placedWords.push({
        word: first.answer,
        clue: first.clue,
        startX: 0,
        startY: 0,
        orientation: "across",
        number: first.number,
    });

    // --- Place Subsequent Words using Human-Like Scoring ---
    for (let i = 1; i < sortedItems.length; i++) {
        const item = sortedItems[i];
        const currentGrid = buildGridMap(placedWords);

        let bestOption: {
            startX: number;
            startY: number;
            orientation: "across" | "down";
            score: number;
        } | null = null;
        let maxScore = -1;

        for (const placed of placedWords) {
            for (let wIdx = 0; wIdx < item.answer.length; wIdx++) {
                for (let pIdx = 0; pIdx < placed.word.length; pIdx++) {
                    if (item.answer[wIdx] === placed.word[pIdx]) {
                        const orientation: "across" | "down" =
                            placed.orientation === "across" ? "down" : "across";

                        let startX = 0;
                        let startY = 0;

                        if (
                            placed.orientation === "across" &&
                            orientation === "down"
                        ) {
                            startX = placed.startX + pIdx;
                            startY = placed.startY - wIdx;
                        } else if (
                            placed.orientation === "down" &&
                            orientation === "across"
                        ) {
                            startX = placed.startX - wIdx;
                            startY = placed.startY + pIdx;
                        } else if (
                            placed.orientation === "across" &&
                            orientation === "across"
                        ) {
                            continue;
                        } else {
                            continue;
                        }

                        // Test if this position works
                        const test = testPlacement(
                            item.answer,
                            startX,
                            startY,
                            orientation,
                            currentGrid,
                        );

                        if (test.isValid) {
                            // HUMAN SCORING LOGIC:
                            // 1. Reward multi-intersections heavily (crossing more than 1 word is premium)
                            // 2. Reward centrality (intersections closer to the middle of the new word)
                            const centrality =
                                1 -
                                Math.abs(wIdx - item.answer.length / 2) /
                                    (item.answer.length / 2);
                            const score = test.intersections * 10 + centrality;

                            if (score > maxScore) {
                                maxScore = score;
                                bestOption = {
                                    startX,
                                    startY,
                                    orientation,
                                    score,
                                };
                            }
                        }
                    }
                }
            }
        }

        // If we found a valid human-like spot, place it!
        if (bestOption) {
            placedWords.push({
                word: item.answer,
                clue: item.clue,
                startX: bestOption.startX,
                startY: bestOption.startY,
                orientation: bestOption.orientation,
                number: item.number,
            });
        } else {
            isolatedItems.push(item);
        }
    }

    // Keep words without a possible intersection in the same puzzle grid.
    let isolatedStartY = placedWords.reduce((maxY, word) => {
        const endY =
            word.orientation === "down"
                ? word.startY + word.word.length
                : word.startY + 1;
        return Math.max(maxY, endY);
    }, 0);
    isolatedItems.forEach((item) => {
        placedWords.push({
            word: item.answer,
            clue: item.clue,
            startX: 0,
            startY: isolatedStartY + 1,
            orientation: "across",
            number: item.number,
        });
        isolatedStartY += item.answer.length > 0 ? 2 : 1;
    });

    // Normalize coordinates so the grid always starts at (0,0) or positive indices
    let minX = Infinity;
    let minY = Infinity;
    placedWords.forEach((pw) => {
        if (pw.startX < minX) minX = pw.startX;
        if (pw.startY < minY) minY = pw.startY;
    });

    return placedWords.map((pw) => ({
        ...pw,
        startX: pw.startX - minX,
        startY: pw.startY - minY,
    }));
}
