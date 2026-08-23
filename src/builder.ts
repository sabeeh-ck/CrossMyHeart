import { generateLayout, type CrosswordItem } from "./crosswordEngine";
import { createIcons, X } from "lucide";
import "./main";

let items: CrosswordItem[] = [{ clue: "", answer: "" }];
const rowsContainer = document.querySelector<HTMLDivElement>("#rows-container");
const addRowBtn = document.querySelector<HTMLButtonElement>("#add-row-btn");
const wordCountDisplay = document.querySelector<HTMLSpanElement>("#word-count");
const gridPreview = document.querySelector<HTMLDivElement>("#grid-preview");
const shuffleBtn = document.querySelector<HTMLButtonElement>("#shuffle-btn");
const MAX_WORDS = 10;

const updateGridPreview = () => {
    if (!gridPreview) return;
    const validItems = items.filter((item) => item.answer.trim().length > 0);
    if (validItems.length === 0) {
        gridPreview.innerHTML = `<p class="text-sm text-muted italic">Add words to generate your crossword grid...</p>`;
        return;
    }

    const placedWords = generateLayout(validItems);
    let maxCol = 0;
    let maxRow = 0;
    placedWords.forEach((word) => {
        const endCol =
            word.orientation === "across"
                ? word.startX + word.word.length
                : word.startX + 1;
        const endRow =
            word.orientation === "down"
                ? word.startY + word.word.length
                : word.startY + 1;
        if (endCol > maxCol) maxCol = endCol;
        if (endRow > maxRow) maxRow = endRow;
    });

    const gridMatrix: { [key: string]: string } = {};
    placedWords.forEach((word) => {
        for (let index = 0; index < word.word.length; index++) {
            const x =
                word.orientation === "across"
                    ? word.startX + index
                    : word.startX;
            const y =
                word.orientation === "down" ? word.startY + index : word.startY;
            gridMatrix[`${x},${y}`] = word.word[index];
        }
    });

    let html = `<div class="grid gap-1.5" style="grid-template-columns: repeat(${maxCol}, minmax(0, 1fr));">`;
    for (let y = 0; y < maxRow; y++) {
        for (let x = 0; x < maxCol; x++) {
            const char = gridMatrix[`${x},${y}`];
            html += char
                ? `<div class="flex h-9 w-9 items-center justify-center border border-border bg-accent font-serif text-sm font-bold text-grid-cell-text">${char}</div>`
                : `<div class="h-9 w-9"></div>`;
        }
    }
    gridPreview.innerHTML = `${html}</div>`;
};

const renderRows = () => {
    if (!rowsContainer) return;
    rowsContainer.innerHTML = "";
    items.forEach((item, index) => {
        const rowDiv = document.createElement("div");
        rowDiv.className =
            "flex items-start justify-between gap-3 border border-border bg-surface p-3";
        rowDiv.innerHTML = `
            <span class="w-5 pt-2 text-sm font-bold text-accent">${index + 1}</span>
            <div class="flex flex-1 flex-col gap-2">
                <input type="text" placeholder="Clue" value="${item.clue}" data-index="${index}" data-field="clue" class="clue-input w-full flex-1 border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-focus-ring focus:outline-none" />
                <input type="text" placeholder="ANSWER" value="${item.answer}" data-index="${index}" data-field="answer" class="answer-input w-full border border-border bg-bg px-3 py-2 text-sm font-bold tracking-wider text-accent uppercase placeholder:text-muted focus:border-focus-ring focus:outline-none" maxLength="12" />
            </div>
            <button data-index="${index}" class="delete-btn px-1 py-2 text-muted transition hover:text-accent"><i data-lucide="x"></i></button>`;
        rowsContainer.appendChild(rowDiv);
    });
    if (wordCountDisplay)
        wordCountDisplay.textContent = `${items.length} / ${MAX_WORDS} max`;
    createIcons({ icons: { X } });
    updateGridPreview();
};

shuffleBtn?.addEventListener("click", () => {
    if (items.length <= 2) return;
    const [first, ...rest] = items;
    for (let index = rest.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [rest[index], rest[randomIndex]] = [rest[randomIndex], rest[index]];
    }
    items = [first, ...rest];
    renderRows();
});

rowsContainer?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    const index = parseInt(target.dataset.index || "0", 10);
    const field = target.dataset.field as "clue" | "answer";
    items[index][field] =
        field === "answer"
            ? target.value.toUpperCase().replace(/[^A-Z]/g, "")
            : target.value;
    target.value = items[index][field];
    updateGridPreview();
});

rowsContainer?.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
        ".delete-btn",
    );
    if (!target) return;
    items.splice(parseInt(target.dataset.index || "0", 10), 1);
    renderRows();
});

addRowBtn?.addEventListener("click", () => {
    if (items.length < MAX_WORDS) {
        items.push({ clue: "", answer: "" });
        renderRows();
    }
});

renderRows();
