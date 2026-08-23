export const renderHeader = (): void => {
    const header = document.querySelector<HTMLElement>("#site-header");

    if (!header) return;

    header.innerHTML = `
        <header>
            <nav
                class="mx-6 flex max-w-6xl items-center justify-between py-8 lg:mx-auto lg:gap-4"
                aria-label="Primary"
            >
                <a
                    class="font-logo flex items-center gap-2 no-underline lg:gap-4"
                    href="./index.html"
                >
                    <span
                        class="bg-accent text-accent-text grid size-9 place-items-center rounded-full"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.654 12.346V16.385C6.654 16.5643 6.71167 16.7117 6.827 16.827C6.94233 16.9423 7.08967 17 7.269 17H10.711C10.891 17 11.0387 16.9423 11.154 16.827C11.2693 16.7117 11.327 16.5643 11.327 16.385V12.346H6.654ZM5.654 11.346V6.673H1.616C1.436 6.673 1.28833 6.73067 1.173 6.846C1.05767 6.96133 1 7.10933 1 7.29V10.732C1 10.9113 1.05767 11.0587 1.173 11.174C1.28833 11.2893 1.436 11.347 1.616 11.347L5.654 11.346ZM6.654 11.346H11.327V6.673H6.654V11.346ZM12.327 11.346H16.385C16.5643 11.346 16.7117 11.2883 16.827 11.173C16.9423 11.0577 17 10.9103 17 10.731V6.673H12.327V11.346ZM12.327 5.673H17V1.616C17 1.436 16.9423 1.28833 16.827 1.173C16.7117 1.05767 16.5643 1 16.385 1H12.942C12.7627 1 12.6153 1.05767 12.5 1.173C12.3847 1.28833 12.327 1.436 12.327 1.616V5.673ZM5.654 12.346H1.616C1.17133 12.346 0.791 12.188 0.475 11.872C0.158333 11.5553 0 11.1747 0 10.73V7.288C0 6.84333 0.158333 6.463 0.475 6.147C0.791667 5.831 1.17167 5.67267 1.615 5.672H11.327V1.616C11.327 1.17133 11.4853 0.791 11.802 0.475C12.1187 0.159 12.4987 0.000666667 12.942 0H16.385C16.829 0 17.209 0.158333 17.525 0.475C17.841 0.791667 17.9993 1.17167 18 1.615V10.731C18 11.175 17.8417 11.555 17.525 11.871C17.209 12.1877 16.829 12.346 16.385 12.346H12.327V16.385C12.327 16.829 12.169 17.209 11.853 17.525C11.537 17.841 11.1567 17.9993 10.712 18H7.269C6.825 18 6.445 17.8417 6.129 17.525C5.81233 17.209 5.654 16.829 5.654 16.385V12.346Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    <span class="text-accent text-base font-black lg:text-3xl"
                        >Cross My Heart.</span
                    >
                </a>

                <div
                    class="flex items-center justify-between gap-3 sm:justify-end md:gap-5"
                >
                    <a
                        href="/builder.html"
                        class="bg-accent hover:bg-accent-hover text-accent-text hidden items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition duration-180 active:scale-95 lg:inline-flex lg:hover:-translate-y-0.5"
                    >
                        Create yours
                        <i data-lucide="arrow-up-right" class="size-5"></i>
                    </a>

                    <div id="theme-dropdown" class="relative w-fit">
                        <button
                            id="theme-button"
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded="false"
                            class="border-border bg-surface text-text hover:border-accent focus:border-focus-ring flex items-center gap-2 rounded-md border px-3 py-2.5 text-xs transition focus:outline-none"
                        >
                            <i data-lucide="heart" class="text-accent size-3"></i>
                            <span>Romance</span>
                            <i data-lucide="chevron-down" class="size-3"></i>
                        </button>

                        <div
                            id="theme-menu"
                            role="listbox"
                            class="border-border bg-surface absolute right-0 z-20 mt-2 hidden min-w-full rounded-xl border p-1"
                        >
                            <button
                                type="button"
                                role="option"
                                data-value="romance"
                                data-label="Romance"
                                data-icon="heart"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#7a263a]"
                            >
                                <i data-lucide="heart" class="size-4"></i>
                                <span>Romance</span>
                            </button>

                            <button
                                type="button"
                                role="option"
                                data-value="birthday"
                                data-label="Birthday"
                                data-icon="cake"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#e85d4a]"
                            >
                                <i data-lucide="cake" class="size-4"></i>
                                <span>Birthday</span>
                            </button>

                            <button
                                type="button"
                                role="option"
                                data-value="wedding"
                                data-label="Wedding"
                                data-icon="gem"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#c9a96e]"
                            >
                                <i data-lucide="gem" class="size-4"></i>
                                <span>Wedding</span>
                            </button>

                            <button
                                type="button"
                                role="option"
                                data-value="baby-shower"
                                data-label="Baby Shower"
                                data-icon="baby"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#76BBD3]"
                            >
                                <i data-lucide="baby" class="size-4"></i>
                                <span>Baby Shower</span>
                            </button>

                            <button
                                type="button"
                                role="option"
                                data-value="graduation"
                                data-label="Graduation"
                                data-icon="graduation-cap"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#23395D]"
                            >
                                <i data-lucide="graduation-cap" class="size-4"></i>
                                <span>Graduation</span>
                            </button>

                            <button
                                type="button"
                                role="option"
                                data-value="celebration"
                                data-label="Celebration"
                                data-icon="party-popper"
                                class="theme-option hover:bg-bg flex w-full items-center gap-2 rounded-sm p-2 text-left text-xs text-[#285943]"
                            >
                                <i data-lucide="party-popper" class="size-4"></i>
                                <span>Celebration</span>
                            </button>
                        </div>

                        <input
                            type="hidden"
                            id="theme-selector"
                            name="theme"
                            value="romance"
                        />
                    </div>
                </div>
            </nav>
        </header>
    `;
};
