import { APP_STATE } from "./index.js";

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
        
        this.toggleMenuAndGenrePills = this.toggleMenuAndGenrePills.bind(this);
        this.toggleGenrePillsDisplay =
            this.toggleGenrePillsDisplay.bind(this);
        this.showHasSelectedGenre = this.showHasSelectedGenre.bind(this);
        this.createGenreSelector = this.createGenreSelector.bind(this);

        this.genrePillContainer
            .addEventListener("click", this.toggleMenuAndGenrePills);
        this.headerExpander
            .addEventListener("click", this.toggleGenrePillsDisplay);
    }

    toggleMenuAndGenrePills(event) {
        const { textContent, classList } = event.target;

        switch (true) {
            case classList.contains("dynamic-pill"):
                classList.toggle("highlighted");
                this.selectedGenres.has(textContent)
                    ? this.selectedGenres.delete(textContent)
                    : this.selectedGenres.add(textContent);
                
            case classList.contains("genre-pill-reset"):
                this.handleSelectedGenre(textContent);
                break;
            case classList.contains("expander"):
                this.toggleGenrePillsDisplay();
                break;
            default:
                break;
        }
    }

    toggleGenrePillsDisplay() {
        this.hamburgerBars.forEach(bar => bar.classList.toggle("fold"));
        this.genrePillContainer.classList.toggle("collapsed");
        this.genrePillContainer.classList.toggle("expanded");
    }

    handleSelectedGenre(selectedGenre) {
        if (selectedGenre === "Remove filters!") {
            APP_STATE.searchBar.element.value = "";
            APP_STATE.webNetworkSelector.selectedWebNetwork = undefined;
            this.selectedGenres.clear();
        }

        APP_STATE.setAndDisplayFilteredShows();
    }

    filterByGenres(shows) {
        return shows.filter(this.showHasSelectedGenre);
    }

    showHasSelectedGenre(show) {
        const allSelectedGenres = Array.from(this.selectedGenres);
        return allSelectedGenres
            .every(selectedGenre => show.genres.includes(selectedGenre));
    }
    
    setGenreSelectors() {
        this.removePreviousGenrePills();
    
        Array.from(this.selectedGenres)
            .forEach(this.createGenreSelector);
        Array.from(APP_STATE.genres)
            .filter(genre => !this.selectedGenres.has(genre))
            .sort()
            .forEach(this.createGenreSelector);
    }

    removePreviousGenrePills() {
        const allPreviousPills = Array.from(
            document.querySelectorAll(".genre-pills > li")
        );
        const previousDynamicPills = allPreviousPills.filter(
            selector => selector.classList.contains("dynamic-pill")
        );
    
        previousDynamicPills.forEach(pill => pill.remove());
    } 
    
    createGenreSelector(genre) {
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