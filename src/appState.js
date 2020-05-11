import { SearchBar } from "./searchBar.js";

export class AppState {
    constructor() {
        this.pageNumber = 1;
        this.allShows = [];
        this.filteredShows = [];
        this.searchBar = new SearchBar();
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
}