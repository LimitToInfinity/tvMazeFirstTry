import { Pages } from "./pages.js";
import { WebNetworkSelector } from "./webNetworkSelector.js";
import { SortBy } from "./sortBy.js";
import { SearchBar } from "./searchBar.js";
import { GenreSelector } from "./genreSelector.js";

import { sorter } from "./sort.js";
import { displayShows } from "./index.js";

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

  setAndDisplayFilteredShows() {
    const shows = this.genreSelector.filterByGenres(
      this.webNetworkSelector.filterByWebNetwork(
        this.searchBar.filterByName()
      )
    );
    const sortedShows =
      sorter[this.sortBy.element.value](shows);
    this.filteredShows = sortedShows;

    this.pageNumber = 1;
    this.pages.displayPagesView();    
    displayShows();
  }

  setGenres() {
    this.filteredShows.forEach(show => {
      show.genres.forEach(genre => {
        this.genres.add(genre);
      });
    });
  }

  setWebNetworks() {
    this.filteredShows.forEach(show => {
      show.webChannel
        ? this.webNetworks.add(show.webChannel.name)
        : undefined;
    });
  }
}