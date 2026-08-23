import { renderLayout } from "./layout";
import { createIcons, Send } from "lucide";

renderLayout({ showCreateButton: false, showThemeSelector: false });
createIcons({ icons: { Send } });

const contactLinks = document.querySelectorAll<HTMLElement>(
    "#email-me, #privacy-email-me",
);
const user = "sabeeh-ck";
const domain = "outlook.com";
contactLinks.forEach((contactLink) => {
    contactLink.addEventListener("click", () => {
        window.location.href = `mailto:${user}@${domain}`;
    });
});
