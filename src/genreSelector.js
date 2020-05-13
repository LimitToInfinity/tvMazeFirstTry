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
            .querySelector(".hamburger");
        this.headerExpander = document.querySelector("header > .hamburger");
        this.hamburgerBars =
            Array.from(
                this.sidebarExpander.querySelectorAll("span")
            ).concat(Array.from(
                this.headerExpander.querySelectorAll("span")
            ));
        
        this.genrePillContainer
            .addEventListener("click", this.handleGenrePill);
        this.headerExpander
            .addEventListener("click", this.toggleGenrePillsDisplay);
    }

    handleGenrePill = (event) => {
        const { textContent, classList } = event.target;

        switch (true) {
            case classList.contains("dynamic-pill"):
                classList.toggle("highlighted");
                this.selectedGenres.has(textContent)
                    ? this.selectedGenres.delete(textContent)
                    : this.selectedGenres.add(textContent);
                
            case classList.contains("genre-pill-reset"):
                this.filterByGenre(event);
                break;
            case classList.contains("expander"):
                this.toggleGenrePillsDisplay();
                break;
            default:
                break;
        }
    }

    toggleGenrePillsDisplay = () => {
        this.hamburgerBars.forEach(bar => bar.classList.toggle("fold"));
        this.genrePillContainer.classList.toggle("collapsed");
        this.genrePillContainer.classList.toggle("expanded");
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
        selector.classList.add("dynamic-pill");
        selector.textContent = genre;
        if (this.selectedGenres.has(genre)) {
            selector.classList.add("highlighted");
        }
        
        this.genrePillContainer.append(selector);
    }
}