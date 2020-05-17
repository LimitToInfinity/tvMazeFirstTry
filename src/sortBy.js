import { APP_STATE } from "./index.js";

export class SortBy {
    constructor(cssSelector = "#sort-by") {
        this.element = document.querySelector(cssSelector);
        
        this.element.addEventListener("change", this.sortAndDisplayShows);
    }

    sortAndDisplayShows() {
        APP_STATE.setAndDisplayFilteredShows();
    }
}