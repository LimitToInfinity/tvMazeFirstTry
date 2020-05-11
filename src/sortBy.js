import {
    APP_STATE,
    displayShows
} from "./index.js";

export function SortBy(cssSelector) {
    const sortBy = document.querySelector(cssSelector);

    sortBy.addEventListener("change", () => {
        displayShows(APP_STATE.filteredShows)
    });

    return sortBy;
}