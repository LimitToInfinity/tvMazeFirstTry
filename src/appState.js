import { Pages } from "./Pages.js";
import { WebNetworkSelector } from "./WebNetworkSelector.js";
import { SortBy } from "./SortBy.js";
import { SearchBar } from "./SearchBar.js";
import { GenreSelector } from "./GenreSelector.js";

export class AppState {
    constructor() {
        this.pageNumber = 1;
        
        this.allShows = [];
        this.filteredShows = [];

        this.genres = new Set();
        this.webNetworks = new Set();
        
        this.pages = new Pages();
        this.webNetworkSelector = new WebNetworkSelector();
        this.sortBy = new SortBy();
        this.searchBar = new SearchBar();
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

    setWebNetworks = (shows) => {
        shows.forEach(show => {
            show.webChannel
                ? this.webNetworks.add(show.webChannel.name)
                : undefined;
        });
    }
}