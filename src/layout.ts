import { renderHeader, type HeaderOptions } from "./components/Header";
import { renderFooter } from "./components/Footer";

export function renderLayout(options?: HeaderOptions): void {
    renderHeader(options);
    renderFooter();
}
