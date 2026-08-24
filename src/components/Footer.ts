export const renderFooter = (): void => {
    const footer = document.querySelector<HTMLElement>("#site-footer");

    if (!footer) return;

    footer.innerHTML = `
        <footer class="bg-surface mt-12 pt-12 pb-6">
            <div class="mx-6 flex flex-col max-w-6xl gap-6 lg:mx-auto">
                <div class="flex flex-col items-start">
                    <a
                        class="flex items-center gap-2 text-base no-underline md:gap-4 md:text-3xl"
                        href="/index.html"
                    >
                        <span
                            class="size-9 shrink-0 place-items-center rounded-full"
                        >
                            <svg
                                width="36"
                                height="36"
                                viewBox="0 0 36 36"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="36"
                                    height="36"
                                    rx="18"
                                    class="fill-accent"
                                />

                                <g transform="translate(9 9)">
                                    <path
                                        d="M6.654 12.346V16.385C6.654 16.5643 6.71167 16.7117 6.827 16.827C6.94233 16.9423 7.08967 17 7.269 17H10.711C10.891 17 11.0387 16.9423 11.154 16.827C11.2693 16.7117 11.327 16.5643 11.327 16.385V12.346H6.654ZM5.654 11.346V6.673H1.616C1.436 6.673 1.28833 6.73067 1.173 6.846C1.05767 6.96133 1 7.10933 1 7.29V10.732C1 10.9113 1.05767 11.0587 1.173 11.174C1.28833 11.2893 1.436 11.347 1.616 11.347L5.654 11.346ZM6.654 11.346H11.327V6.673H6.654V11.346ZM12.327 11.346H16.385C16.5643 11.346 16.7117 11.2883 16.827 11.173C16.9423 11.0577 17 10.9103 17 10.731V6.673H12.327V11.346ZM12.327 5.673H17V1.616C17 1.436 16.9423 1.28833 16.827 1.173C16.7117 1.05767 16.5643 1 16.385 1H12.942C12.7627 1 12.6153 1.05767 12.5 1.173C12.3847 1.28833 12.327 1.436 12.327 1.616V5.673ZM5.654 12.346H1.616C1.17133 12.346 0.791 12.188 0.475 11.872C0.158333 11.5553 0 11.1747 0 10.73V7.288C0 6.84333 0.158333 6.463 0.475 6.147C0.791667 5.831 1.17167 5.67267 1.615 5.672H11.327V1.616C11.327 1.17133 11.485 0.791 11.802 0.475C12.1187 0.159 12.4987 0.000666667 12.942 0H16.385C16.829 0 17.209 0.158333 17.525 0.475C17.841 0.791667 17.9993 1.17167 18 1.615V10.731C18 11.175 17.8417 11.555 17.525 11.871C17.209 12.1877 16.829 12.346 16.385 12.346H12.327V16.385C12.327 16.829 12.169 17.209 11.853 17.525C11.537 17.841 11.1567 17.9993 10.712 18H7.269C6.825 18 6.445 17.8417 6.129 17.525C5.81233 17.209 5.654 16.829 5.654 16.385V12.346Z"
                                        class="fill-accent-text"
                                    />
                                </g>
                            </svg>
                        </span>
                        <span class="font-logo text-accent text-2xl font-black tracking-normal">
                            Cross My Heart.
                        </span>
                    </a>
                    <p class="text-muted text-xs ml-11 lg:ml-13">
                        Create personalized crosswords for every
                        occasion.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div class="flex flex-col gap-2 items-start text-sm font-semibold">
                        <p class="text-muted text-xs font-bold uppercase">
                            Links
                        </p>
                        <div class="flex flex-col gap-3 md:flex-row md:gap-6">
                            <a href="/builder.html" class="lg:hover:underline">
                                Create a crossword
                            </a>
                            <span class="hidden text-muted md:block">•</span>
                            <a href="/privacy.html" class="lg:hover:underline">
                                Privacy
                            </a>
                        </div>
                    </div>

                    <div class="flex flex-col items-start gap-2 text-sm font-semibold">
                        <p class="text-muted text-xs font-bold uppercase">
                            Contact
                        </p>
                        <div class="flex flex-col gap-3 md:flex-row md:gap-6">
                            <button type="button" id="email-me" class="text-start cursor-pointer hover:underline">
                                Contact me
                            </button>
                            <span class="hidden text-muted md:block">•</span>
                            <a
                                href="https://github.com/sabeeh-ck/CrossMyHeart/issues/new"
                                class="lg:hover:underline"
                            >
                                Report an issue
                            </a>
                        </div>
                    </div>
                </div>

                <div class="inset-x-0 flex justify-center">
                    <p class="text-xs">
                        Made with 💚 by
                        <a
                            href="https://sabeeh-ck.vercel.app"
                            target="_blank"
                            class="font-bold lg:hover:underline"
                        >
                            sabeeh-ck
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    `;
};
