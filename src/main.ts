import {
    createIcons,
    Plus,
    Shuffle,
    Heart,
    Sparkles,
    ArrowUpRight,
    MapPin,
    Coffee,
    ChevronDown,
    X,
    ShieldLock,
    SwatchBook,
    PencilLine,
    FileDown,
} from "lucide";
import { renderLayout } from "./layout";
import { themeIcons } from "./components/Header";

renderLayout({
    showCreateButton: !window.location.pathname.endsWith("/builder.html"),
});

const contactLink = document.querySelector<HTMLElement>("#email-me");
const user = "sabeeh-ck";
const domain = "outlook.com";

contactLink?.addEventListener("click", () => {
    window.location.href = `mailto:${user}@${domain}`;
});

const themeButton = document.querySelector<HTMLButtonElement>("#theme-button");
const menu = document.getElementById("theme-menu");
const themeSelector =
    document.querySelector<HTMLInputElement>("#theme-selector");

themeButton?.addEventListener("click", () => {
    const isOpen = !menu?.classList.contains("hidden");

    menu?.classList.toggle("hidden", isOpen);
    themeButton.setAttribute("aria-expanded", String(!isOpen));
});

const themes = new Set([
    "romance",
    "birthday",
    "wedding",
    "baby-shower",
    "graduation",
    "celebration",
]);

const icons = {
    ...themeIcons,
    ShieldLock,
    Plus,
    Heart,
    Shuffle,
    Sparkles,
    ArrowUpRight,
    MapPin,
    Coffee,
    ChevronDown,
    X,
    SwatchBook,
    PencilLine,
    FileDown,
};

createIcons({
    icons: icons,
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
            icons: icons,
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
