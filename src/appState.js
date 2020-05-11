import { SearchBar } from "./searchBar.js";
import { GenreSelector } from "./genreSelector.js";
import { Pages } from "./pages.js";
import { SortBy } from "./sortBy.js";

export class AppState {
    constructor() {
        this.pageNumber = 1;
        
        this.allShows = [];
        this.filteredShows = [];

        this.genres = new Set();
        
        this.searchBar = new SearchBar();
        this.sortBy = new SortBy();
        this.pages = new Pages();
        this.genreSelector = new GenreSelector();
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