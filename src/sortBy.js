import {
    APP_STATE,
    displayShows
} from "./index.js";

export class SortBy {
    constructor(cssSelector = ".sort-by") {
        this.element = document.querySelector(cssSelector);
        
        this.element.addEventListener("change", () => {
            displayShows(APP_STATE.filteredShows)
        });
    }
}