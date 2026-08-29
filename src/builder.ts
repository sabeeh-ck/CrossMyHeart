import { generateLayout, type CrosswordItem } from "./crosswordEngine";
import { ChevronDown, createIcons, FileDown, X } from "lucide";
import "./main";
import { bindPrintMenu } from "./pdf";

let items: CrosswordItem[] = [{ clue: "", answer: "" }];
const rowsContainer = document.querySelector<HTMLDivElement>("#rows-container");
const addRowBtn = document.querySelector<HTMLButtonElement>("#add-row-btn");
const wordCountDisplay = document.querySelector<HTMLSpanElement>("#word-count");
const gridPreview = document.querySelector<HTMLDivElement>("#grid-preview");
const shuffleBtn = document.querySelector<HTMLButtonElement>("#shuffle-btn");
const MAX_WORDS = 10;
const MAX_ANSWER_LENGTH = 10;

const escapeHtml = (value: string): string =>
    value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            })[character] || character,
    );

const resizeTextarea = (textarea: HTMLTextAreaElement): void => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
};

const updateAddRowButton = (): void => {
    if (!addRowBtn) return;
    const lastItem = items[items.length - 1];
    addRowBtn.disabled =
        items.length >= MAX_WORDS ||
        (items.length > 0 && !lastItem.answer.trim());
};

const updateGridPreview = () => {
    if (!gridPreview) return;
    const preview = gridPreview;
    const validItems = items
        .map((item, index) => ({ ...item, number: index + 1 }))
        .filter((item) => item.answer.trim().length > 0);
    if (validItems.length === 0) {
        preview.innerHTML = `
            <p class="text-sm text-muted italic">
                Add words to generate your crossword grid...
            </p>
        `;
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

    const startCells = new Map<string, string>();
    placedWords.forEach((word) => {
        if (word.number === undefined) return;
        const key = `${word.startX},${word.startY}`;
        const existingNumber = startCells.get(key);
        startCells.set(
            key,
            existingNumber
                ? `${existingNumber}/${word.number}`
                : `${word.number}`,
        );
    });

    const gridGap = window.matchMedia("(min-width: 768px)").matches ? 4 : 2;
    const previewPadding = window.matchMedia("(min-width: 640px)").matches
        ? 56
        : 32;
    const availableWidth = Math.max(
        gridPreview.clientWidth - previewPadding,
        0,
    );
    const cellSize = Math.max(
        16,
        Math.min(
            36,
            Math.floor((availableWidth - gridGap * (maxCol - 1)) / maxCol),
        ),
    );
    const cellStyle = `width: ${cellSize}px; height: ${cellSize}px;`;
    let html = `<div class="grid" style="gap: ${gridGap}px; grid-template-columns: repeat(${maxCol}, ${cellSize}px);">`;
    for (let y = 0; y < maxRow; y++) {
        for (let x = 0; x < maxCol; x++) {
            const char = gridMatrix[`${x},${y}`];
            const number = startCells.get(`${x},${y}`);
            html += char
                ? `
                    <div
                        class="relative flex items-center justify-center rounded-xs border border-accent bg-bg text-xs font-black text-accent sm:rounded-md sm:text-sm"
                        style="${cellStyle} font-size: ${Math.max(10, Math.floor(cellSize * 0.4))}px;"
                    >
                        <span class="absolute top-0.5 left-0.5 leading-none font-bold" style="font-size: ${Math.max(6, Math.floor(cellSize * 0.2))}px;">${number || ""}</span>
                        ${char}
                    </div>
                `
                : `<div style="${cellStyle}"></div>`;
        }
    }
    html += `</div>`;

    const renderClues = (orientation: "across" | "down", title: string) => {
        const clues = placedWords
            .filter((word) => word.orientation === orientation)
            .map((word) => ({
                ...word,
                number: word.number,
            }))
            .sort((wordA, wordB) => (wordA.number || 0) - (wordB.number || 0));

        return clues.length > 0
            ? `
            <div class="min-w-0">
                <h3 class="text-accent-hover mb-2 text-xs font-bold tracking-widest uppercase">${title}</h3>
                <ol class="space-y-2"> 
                    ${clues
                        .map(
                            (word) => `
                            <li class="grid grid-cols-[1.5rem_1fr_1.5rem] gap-1 text-sm leading-snug">
                                <span class="font-bold text-accent-hover">
                                    ${word.number}.
                                </span>
                                <span class="first-letter:uppercase">${escapeHtml(word.clue)}</span>
                                <span class="font-bold text-accent-hover">(${word.word.length})</span>
                            </li>
                        `,
                        )
                        .join("")}
                </ol>
            </div>
        `
            : "";
    };

    preview.innerHTML = `
        <div class="flex w-full flex-col items-center gap-6 sm:gap-8">
            <div class="max-w-full p-1">
                ${html}
            </div>
            <div
                class="grid w-full grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-2"
            >
                ${renderClues("across", "Across")}${renderClues("down", "Down")}
            </div>

            <div class="relative w-full flex items-center justify-center gap-0.5">
                <button
                    type="button"
                    id="print-button"
                    class="bg-accent text-accent-text px-4 py-2 flex items-center gap-2 rounded-l-lg rounded-r-sm font-bold text-sm transition-all duration-200 active:ring-2 active:ring-inset active:ring-accent-hover active:scale-95 lg:hover:bg-accent-hover"
                >
                    <i data-lucide="file-down" class="size-4 stroke-2"></i>
                    Download (A4)
                </button>

                <button type="button"
                    id="print-type"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    class="bg-accent text-accent-text p-2 flex items-center gap-2 rounded-r-lg rounded-l-sm font-bold text-sm transition-all duration-200 active:ring-2 active:ring-inset active:ring-accent-hover active:scale-95 lg:hover:bg-accent-hover"
                >
                    <i data-lucide="chevron-down" class="size-5"></i>
                </button>

                <div
                    id="print-menu"
                    role="listbox"
                    class="absolute left-0 top-full z-50 mt-2 hidden flex-col items-start overflow-visible rounded-xl border border-border bg-bg px-4 py-2 font-bold shadow-lg"
                >
                    <button
                        type="button"
                        data-pdf-size="a5"
                        class="theme-option hover:bg-bg flex items-center gap-2 rounded-md p-2 text-left text-xs"
                    >
                        <span>Download (A5)</span>
                    </button>

                    <button
                        type="button"
                        data-pdf-size="letter"
                        class="theme-option hover:bg-bg flex items-center gap-2 rounded-md p-2 text-left text-xs"
                    >
                        <span>Download (Letter)</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    bindPrintMenu(preview);
    createIcons({ icons: { FileDown, ChevronDown } });
};

window.addEventListener("resize", updateGridPreview);

const renderRows = () => {
    if (!rowsContainer) return;
    rowsContainer.innerHTML = "";
    items.forEach((item, index) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "flex items-start justify-between gap-3 bg-surface";
        rowDiv.innerHTML = `
            <div class="flex flex-1 bg-bg border border-border rounded-lg">
                <span class="w-5 py-2 px-3 font-bold self-start text-accent">${index + 1}</span>
                <div class="flex flex-1 flex-col">
                    <textarea
                        id="clue-input"
                        placeholder="Clue"
                        data-index="${index}"
                        data-field="clue"
                        rows="1"
                        class="w-full resize-none overflow-hidden px-3 pb-1 pt-2 text-sm text-text font-medium placeholder:text-muted focus:border-focus-ring focus:outline-none"
                    >${item.clue}</textarea>
                    <input
                        type="text"
                        placeholder="ANSWER"
                        value="${item.answer}"
                        data-index="${index}"
                        data-field="answer"
                        class="answer-input w-full px-3 pb-2 pt-1 text-sm font-bold tracking-wider text-accent uppercase placeholder:text-muted focus:border-focus-ring focus:outline-none"
                        maxLength="${MAX_ANSWER_LENGTH}"
                    />
                </div>
                <button
                    data-index="${index}"
                    class="delete-btn p-2 self-center mx-2 text-muted transition ring ring-border rounded-md hover:text-accent hover:ring-accent active:ring-accent active:ring-2"
                >
                    <i data-lucide="x" class="size-4"></i>
                </button>
            </div>`;
        rowsContainer.appendChild(rowDiv);
    });
    rowsContainer
        .querySelectorAll<HTMLTextAreaElement>("[data-field='clue']")
        .forEach(resizeTextarea);
    if (wordCountDisplay)
        wordCountDisplay.textContent = `${items.length} / ${MAX_WORDS} max`;
    updateAddRowButton();
    createIcons({ icons: { X } });
    updateGridPreview();
};

shuffleBtn?.addEventListener("click", () => {
    if (items.length <= 1) return;

    let shuffledItems: CrosswordItem[];
    do {
        shuffledItems = [...items];
        for (let index = shuffledItems.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffledItems[index], shuffledItems[randomIndex]] = [
                shuffledItems[randomIndex],
                shuffledItems[index],
            ];
        }
    } while (shuffledItems.every((item, index) => item === items[index]));

    items = shuffledItems;
    renderRows();
});

rowsContainer?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target instanceof HTMLTextAreaElement) resizeTextarea(target);
    const index = parseInt(target.dataset.index || "0", 10);
    const field = target.dataset.field as "clue" | "answer";
    items[index][field] =
        field === "answer"
            ? target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, MAX_ANSWER_LENGTH)
            : target.value;
    target.value = items[index][field];
    updateAddRowButton();
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
    items.push({ clue: "", answer: "" });
    renderRows();
});

renderRows();
