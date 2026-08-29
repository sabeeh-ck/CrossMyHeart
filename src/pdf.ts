import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const PDF_FORMATS = {
    a4: { label: "A4", format: "a4" },
    a5: { label: "A5", format: "a5" },
    letter: { label: "Letter", format: "letter" },
} as const;

export type PdfFormat = keyof typeof PDF_FORMATS;

const getCanvasAndPdf = async (
    element: HTMLElement,
    format: PdfFormat,
): Promise<{ canvas: HTMLCanvasElement; pdf: jsPDF }> => {
    const downloadButton =
        element.querySelector<HTMLButtonElement>("#print-button");
    const printTypeButton =
        element.querySelector<HTMLButtonElement>("#print-type");
    const printMenu = element.querySelector<HTMLDivElement>("#print-menu");
    if (downloadButton) downloadButton.style.display = "none";
    if (printTypeButton) printTypeButton.style.display = "none";
    if (printMenu) printMenu.classList.add("hidden");

    try {
        await document.fonts.ready;
        const backgroundColor = getComputedStyle(document.body).backgroundColor;
        const canvas = await html2canvas(element, {
            backgroundColor,
            scale: 2,
            useCORS: true,
        });
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: PDF_FORMATS[format].format,
        });

        return { canvas, pdf };
    } finally {
        if (downloadButton) downloadButton.style.display = "";
        if (printTypeButton) printTypeButton.style.display = "";
        if (printMenu) printMenu.classList.add("hidden");
    }
};

const parseRgb = (value: string): [number, number, number] => {
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) {
        return [255, 255, 255];
    }

    return [Number(match[1]), Number(match[2]), Number(match[3])];
};

export const downloadPdf = async (
    format: PdfFormat = "a4",
    element: HTMLElement | null = document.querySelector("#grid-preview"),
): Promise<void> => {
    if (!element) return;

    const { canvas, pdf } = await getCanvasAndPdf(element, format);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const backgroundColor = getComputedStyle(document.body).backgroundColor;
    const [r, g, b] = parseRgb(backgroundColor);

    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    const margin = 0;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;
    const scale = Math.min(
        availableWidth / canvas.width,
        availableHeight / canvas.height,
    );
    const imageWidth = canvas.width * scale;
    const imageHeight = canvas.height * scale;

    pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        (pageWidth - imageWidth) / 2,
        (pageHeight - imageHeight) / 2,
        imageWidth,
        imageHeight,
    );
    pdf.save(
        `cross-my-heart-puzzle-${PDF_FORMATS[format].label.toLowerCase()}.pdf`,
    );
};

export const bindPrintMenu = (element: HTMLElement): void => {
    const existing = element.dataset.printMenuBound === "true";
    if (existing) return;
    element.dataset.printMenuBound = "true";

    element.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const printButton = target.closest<HTMLButtonElement>("#print-button");
        const printTypeButton =
            target.closest<HTMLButtonElement>("#print-type");
        const printMenu = element.querySelector<HTMLDivElement>("#print-menu");
        const printTypeToggle =
            element.querySelector<HTMLButtonElement>("#print-type");
        const menuOption = target.closest<HTMLButtonElement>("[data-pdf-size]");

        if (printButton) {
            void downloadPdf("a4", element);
            return;
        }

        if (menuOption) {
            const format = menuOption.dataset.pdfSize as PdfFormat;
            void downloadPdf(format, element);
            if (printMenu) {
                printMenu.classList.add("hidden");
            }
            if (printTypeToggle) {
                printTypeToggle.setAttribute("aria-expanded", "false");
            }
            return;
        }

        if (printTypeButton) {
            if (!printMenu || !printTypeToggle) return;
            const isOpen = printMenu.classList.contains("hidden");
            printMenu.classList.toggle("hidden", !isOpen);
            printTypeToggle.setAttribute("aria-expanded", String(isOpen));
            return;
        }

        if (
            printMenu &&
            !target.closest("#print-menu") &&
            !target.closest("#print-type")
        ) {
            printMenu.classList.add("hidden");
            if (printTypeToggle) {
                printTypeToggle.setAttribute("aria-expanded", "false");
            }
        }
    });
};
