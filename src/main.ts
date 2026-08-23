import { generateLayout, type CrosswordItem } from "./crosswordEngine";
import {
    createIcons,
    Plus,
    Shuffle,
    Heart,
    Sparkles,
    ArrowUpRight,
    LockKeyhole,
    MapPin,
    Coffee,
    ChevronDown,
    Cake,
    Users,
    Puzzle,
    X,
    ShieldLock,
    Gem,
    Baby,
    GraduationCap,
    PartyPopper,
} from "lucide";
import { renderLayout } from "./layout";

renderLayout();

const themeButton = document.querySelector<HTMLButtonElement>("#theme-button");
const menu = document.getElementById("theme-menu");
const themeSelector =
    document.querySelector<HTMLInputElement>("#theme-selector");
const shuffleBtn = document.querySelector<HTMLButtonElement>("#shuffle-btn");

const MAX_WORDS = 10;

themeButton?.addEventListener("click", () => {
    const isOpen = !menu?.classList.contains("hidden");

    menu?.classList.toggle("hidden", isOpen);
    themeButton.setAttribute("aria-expanded", String(!isOpen));
});

shuffleBtn?.addEventListener("click", () => {
    if (items.length <= 2) return;

    const [first, ...rest] = items;

    for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    items = [first, ...rest];
    renderRows();
});

const renderRows = () => {
    if (!rowsContainer) return;
    rowsContainer.innerHTML = "";

    items.forEach((item, index) => {
        const rowDiv = document.createElement("div");
        rowDiv.className =
            "flex items-start justify-between gap-3 border border-border bg-surface p-3 shadow-[.25rem_.25rem_0_rgba(169,78,79,.08)]";
        rowDiv.innerHTML = `
            <span class="w-5 pt-2 text-sm font-bold text-accent">${index + 1}</span>
            <div class="flex flex-1 flex-col gap-2">
                <input
                    type="text"
                    placeholder="Clue"
                    value="${item.clue}"
                    data-index="${index}"
                    data-field="clue"
                    class="clue-input w-full flex-1 border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-focus-ring focus:outline-none"
                />
                <input
                    type="text"
                    placeholder="ANSWER"
                    value="${item.answer}"
                    data-index="${index}"
                    data-field="answer"
                    class="answer-input w-full border border-border bg-bg px-3 py-2 text-sm font-bold tracking-wider text-accent uppercase placeholder:text-muted focus:border-focus-ring focus:outline-none" maxLength="12"
                />
            </div>
            <button
                data-index="${index}"
                class="delete-btn px-1 py-2 text-muted transition hover:text-accent"
            >
                <i data-lucide="x"></i>
            </button>
    `;
        rowsContainer.appendChild(rowDiv);
    });

    if (wordCountDisplay) {
        wordCountDisplay.textContent = `${items.length} / ${MAX_WORDS} max`;
    }

    updateGridPreview();
};

const themes = new Set([
    "romance",
    "birthday",
    "wedding",
    "baby-shower",
    "graduation",
    "celebration",
]);

createIcons({
    icons: {
        ShieldLock,
        Plus,
        Heart,
        Shuffle,
        Sparkles,
        ArrowUpRight,
        LockKeyhole,
        MapPin,
        Coffee,
        ChevronDown,
        Cake,
        Users,
        Puzzle,
        X,
        Gem,
        Baby,
        GraduationCap,
        PartyPopper,
    },
});

const updateTheme = (themeKey: string) => {
    if (!themes.has(themeKey)) return;

    document.documentElement.setAttribute("data-theme", themeKey);
    if (themeSelector) themeSelector.value = themeKey;
    localStorage.setItem("crossmyheart-theme", themeKey);

    const selectedOption = document.querySelector<HTMLElement>(
        `.theme-option[data-value="${themeKey}"]`,
    );
    const labelEl = themeButton?.querySelector("span");
    const iconEl = themeButton?.querySelector("svg");
    if (labelEl && selectedOption) {
        labelEl.textContent = selectedOption.dataset.label || "Theme";
        labelEl.classList = "text-accent";
    }

    if (iconEl && selectedOption) {
        iconEl.outerHTML = `<i data-lucide="${selectedOption.dataset.icon}" class="size-4 text-accent"></i>`;
        createIcons({
            icons: {
                Heart,
                Cake,
                Gem,
                Baby,
                GraduationCap,
                PartyPopper,
                ChevronDown,
            },
        });
    }

    menu?.classList.add("hidden");
    themeButton?.setAttribute("aria-expanded", "false");
};

menu?.addEventListener("click", (e) => {
    const option = (e.target as HTMLElement).closest<HTMLButtonElement>(
        ".theme-option",
    );
    if (option?.dataset.value) updateTheme(option.dataset.value);
});

document.addEventListener("click", (e) => {
    if (
        !themeButton?.contains(e.target as Node) &&
        !menu?.contains(e.target as Node)
    ) {
        menu?.classList.add("hidden");
        themeButton?.setAttribute("aria-expanded", "false");
    }
});

updateTheme(
    localStorage.getItem("crossmyheart-theme") ||
        themeSelector?.value ||
        "romance",
);

const updateGridPreview = () => {
    if (!gridPreview) return;
    const validItems = items.filter((i) => i.answer.trim().length > 0);

    if (validItems.length === 0) {
        gridPreview.innerHTML = `<p class="text-sm text-muted italic">Add words to generate your crossword grid...</p>`;
        return;
    }

    const placedWords = generateLayout(validItems);

    let maxCol = 0;
    let maxRow = 0;
    placedWords.forEach((pw) => {
        const endCol =
            pw.orientation === "across"
                ? pw.startX + pw.word.length
                : pw.startX + 1;
        const endRow =
            pw.orientation === "down"
                ? pw.startY + pw.word.length
                : pw.startY + 1;
        if (endCol > maxCol) maxCol = endCol;
        if (endRow > maxRow) maxRow = endRow;
    });

    const gridMatrix: { [key: string]: string } = {};
    placedWords.forEach((pw) => {
        for (let i = 0; i < pw.word.length; i++) {
            const x = pw.orientation === "across" ? pw.startX + i : pw.startX;
            const y = pw.orientation === "down" ? pw.startY + i : pw.startY;
            gridMatrix[`${x},${y}`] = pw.word[i];
        }
    });

    let html = `<div class="grid gap-1.5" style="grid-template-columns: repeat(${maxCol}, minmax(0, 1fr));">`;

    for (let y = 0; y < maxRow; y++) {
        for (let x = 0; x < maxCol; x++) {
            const char = gridMatrix[`${x},${y}`];
            if (char) {
                html += `<div class="flex h-9 w-9 items-center justify-center border border-border bg-accent font-serif text-sm font-bold text-grid-cell-text">${char}</div>`;
            } else {
                html += `<div class="h-9 w-9"></div>`;
            }
        }
    }
    html += `</div>`;

    gridPreview.innerHTML = html;
};

rowsContainer?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const index = parseInt(target.dataset.index || "0", 10);
    const field = target.dataset.field as "clue" | "answer";

    if (field === "answer") {
        items[index][field] = target.value.toUpperCase().replace(/[^A-Z]/g, "");
        target.value = items[index][field];
    } else {
        items[index][field] = target.value;
    }
    updateGridPreview();
});

rowsContainer?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("delete-btn")) {
        const index = parseInt(target.dataset.index || "0", 10);
        items.splice(index, 1);
        renderRows();
    }
});

addRowBtn?.addEventListener("click", () => {
    if (items.length < MAX_WORDS) {
        items.push({ clue: "", answer: "" });
        renderRows();
    }
});

// Initial render call
renderRows();
