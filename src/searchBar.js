import {
    APP_STATE,
    displayShows
} from "./index.js";

import {
    genres,
    filterByGenres
} from "./genreSelector.js";

import { showPageSlider } from "./pages.js";

export class SearchBar {
    constructor(cssSelector = "#search-bar") {
        this.element = document.querySelector(cssSelector);
        this.label = this.element.labels[0];
        
        this.element.addEventListener("focus", this.addShrinkClass);
        this.element.addEventListener("blur", this.removeShrinkClass);
        this.element.addEventListener("input", this.filterShows);
    }
    
    addShrinkClass = () => {
        this.label.classList.remove("shrink-uncolored");
        this.label.classList.add("shrink-colored");
    }
    
    removeShrinkClass = () => {
        if (!this.element.value) {
            this.label.classList.remove("shrink-colored");
            this.label.classList.remove("shrink-uncolored");
        } else {
            this.label.classList.remove("shrink-colored");
            this.label.classList.add("shrink-uncolored");
        }
    }

    filterShows = (event) => {
        APP_STATE.setPageNumber(1);
        showPageSlider();
        
        const searchTerm = event.target.value;
    
        APP_STATE.setFilteredShows( 
            filterByGenres(
                this.filterByName(APP_STATE.allShows, searchTerm)
            )
        );
        
        if (APP_STATE.filteredShows.length === 0) { 
            genres.clear();
        }
        
        displayShows(APP_STATE.filteredShows);
    }

    filterByName = (shows, searchTerm) => {
        return shows.filter(show => (
            show.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
        ));
    }
}