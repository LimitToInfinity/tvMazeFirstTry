import { filteredShows, displayShows } from "./index.js";

export function SortBy(cssSelector) {
    const sortBy = document.querySelector(`${cssSelector}`);

    sortBy.addEventListener("change", () => displayShows(filteredShows));

    return sortBy;
}