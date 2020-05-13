import { Pages } from "./Pages.js";
import { SearchBar } from "./SearchBar.js";
import { SortBy } from "./SortBy.js";
import { GenreSelector } from "./GenreSelector.js";

export class AppState {
    constructor() {
        this.pageNumber = 1;
        
        this.allShows = [];
        this.filteredShows = [];

        this.genres = new Set();
        
        this.pages = new Pages();
        this.searchBar = new SearchBar();
        this.sortBy = new SortBy();
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