import { SearchBar } from "./searchBar.js";
import { GenreSelector } from "./genreSelector.js";
import { Pages } from "./pages.js";

export class AppState {
    constructor() {
        this.pageNumber = 1;
        
        this.allShows = [];
        this.filteredShows = [];

        this.searchBar = new SearchBar();
        this.genreSelector = new GenreSelector();
        this.pages = new Pages();

        this.genres = new Set();
    }
    
    setPageNumber = (newNumber) => {
        this.pageNumber = newNumber;
    }
    
    setAllShows = (shows) => {
        this.allShows = shows;
    }
    
    setFilteredShows = (shows) => {
        this.filteredShows = shows;
    }

    setGenres = (shows) => {
        shows.forEach(show => {
            show.genres.forEach(genre => {
                this.genres.add(genre);
            });
        });
    }
}