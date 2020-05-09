import {
    setPageNumber,
    allShows,
    filteredShows,
    setFilteredShows,
    displayShows,
    filterByGenres,
    filterByName,
    genres,
    setGenreSelectors
} from "./index.js"

import { showPageSlider } from "./pages.js";

export function SearchBar(cssSelector) {
    const searchBar = document.querySelector(`${cssSelector}`);
    const searchBarLabel = searchBar.labels[0];
    
    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    searchBar.addEventListener("input", filterShows);
    
    function addShrinkClass() {
        searchBarLabel.classList.remove("shrink-uncolored");
        searchBarLabel.classList.add("shrink-colored");
    }
    
    function removeShrinkClass() {
        if (!searchBar.value) {
            searchBarLabel.classList.remove("shrink-colored");
            searchBarLabel.classList.remove("shrink-uncolored");
        } else {
            searchBarLabel.classList.remove("shrink-colored");
            searchBarLabel.classList.add("shrink-uncolored");
        }
    }

    function filterShows(event) {
        setPageNumber(1);
        showPageSlider();
        
        const searchTerm = event.target.value;
    
        setFilteredShows( 
            filterByGenres(
                filterByName(allShows, searchTerm)
            )
        );
        
        if (filteredShows.length === 0) { 
            genres.clear();
            setGenreSelectors();
        }
        
        displayShows(filteredShows);
    }

    return searchBar;
}