import {
    APP_STATE,
    displayShows
} from "./index.js";

export class GenreSelector {
    constructor() {
        this.selectedGenres = new Set();
        
        this.genrePillContainer = document.querySelector(".genre-pills");
        this.genrePillHeader = this.genrePillContainer
            .querySelector(".genre-pill-header");
        this.sidebarExpander = this.genrePillContainer
            .querySelector(".expander");
        this.headerExpander = document.querySelector("header > .expander");
        this.hamburgerBars =
            Array.from(
                this.sidebarExpander.querySelectorAll("span")
            ).concat( Array.from(
                this.headerExpander.querySelectorAll("span")
            ) );
        
        this.genrePillContainer
            .addEventListener("click", this.handleGenrePill);
        this.headerExpander
            .addEventListener("click", this.expandOrContract);
    }

    handleGenrePill = (event) => {
        const { textContent, classList } = event.target;
    
        if (
            classList.contains("genre-pill")
            && classList.contains("highlighted")
        ) {
            classList.remove("highlighted");
            this.selectedGenres.delete(textContent, classList);
            this.filterByGenre(event);
    
        } else if (
            classList.contains("genre-pill")
            && textContent !== "Remove filters!"
        ) {
            classList.add("highlighted");
            this.selectedGenres.add(textContent);
            this.filterByGenre(event);
    
        } else if (textContent === "Remove filters!") {
            this.filterByGenre(event);
    
        } else if (
            classList.contains("expander")
            || classList.contains("genre-pill-header")
            || classList.contains("genre-pill-header-text")
            || classList.contains("fold")
        ) {
            this.expandOrContract();
    
        } else if (!classList.contains("genre-pill")) {
            return;
    
        }
    }
    
    expandOrContract = () => {
        this.hamburgerBars.forEach(bar => bar.classList.toggle("fold"));
    
        if (this.genrePillContainer.classList.contains("collapsed")) {
            this.genrePillContainer.classList.remove("collapsed");
            this.genrePillContainer.classList.add("expanded");
    
            this.genrePillHeader.classList.remove("bottom-sheet");
            if (window.matchMedia('(max-device-width: 600px)').matches) {
                this.genrePillHeader.style.fontSize = "6rem";
            }
        } else if (this.genrePillContainer.classList.contains("expanded")) {
            this.genrePillContainer.classList.remove("expanded");
            this.genrePillContainer.classList.add("collapsed");
            
            this.genrePillHeader.classList.add("bottom-sheet");
            if (window.matchMedia('(max-device-width: 600px)').matches) {
                this.genrePillHeader.style.fontSize = "3rem";
            }
        }
    }

    filterByGenre = (event) => {
        APP_STATE.setPageNumber(1);
        APP_STATE.pages.displayPagesView();
    
        const selectedGenre = event ? event.target.textContent : undefined;
    
        if (selectedGenre === "Remove filters!") {
            APP_STATE.setFilteredShows(APP_STATE.allShows);
            APP_STATE.searchBar.element.value = "";
            
            this.selectedGenres.clear();
        } else {
            APP_STATE.setFilteredShows(
                this.filterByGenres(
                    APP_STATE.searchBar.filterByName(
                        APP_STATE.allShows,
                        APP_STATE.searchBar.element.value
                    )
                )
            );
        }

        displayShows(APP_STATE.filteredShows);
    }

    filterByGenres = (shows) => {
        return shows.filter(this.showHasSelectedGenre);
    }

    showHasSelectedGenre = (show) => {
        const allSelectedGenres = Array.from(this.selectedGenres);
        return allSelectedGenres
            .every(selectedGenre => show.genres.includes(selectedGenre));
    }
    
    setGenreSelectors = () => {
        this.removePreviousGenrePills();
    
        Array.from(this.selectedGenres)
            .forEach(this.createGenreSelector);
        Array.from(APP_STATE.genres)
            .filter(genre => !this.selectedGenres.has(genre))
            .sort()
            .forEach(this.createGenreSelector);
    }

    removePreviousGenrePills = () => {
        const allPreviousPills = Array.from(
            document.querySelectorAll(".genre-pills > li")
        );
        const previousDynamicPills = allPreviousPills.filter(
            selector => !selector.classList.contains("static-pill")
        );
    
        previousDynamicPills.forEach(pill => pill.remove());
    } 
    
    createGenreSelector = (genre) => {
        const selector = document.createElement("li");
        selector.classList.add("genre-pill");
        selector.textContent = genre;
        if (this.selectedGenres.has(genre)) {
            selector.classList.add("highlighted");
        }
        
        this.genrePillContainer.append(selector);
    }
}