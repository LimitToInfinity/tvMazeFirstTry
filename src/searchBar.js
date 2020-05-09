export function SearchBar(cssSelector) {
    const searchBar = document.querySelector(`${cssSelector}`);
    const searchBarLabel = searchBar.labels[0];
    
    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    
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

    return searchBar;
}

// function filterShows(event) {
//     pageNumber = 1;
//     showPageSlider();
    
//     const searchTerm = event.target.value;
   
//     filteredShows = filterByGenres(
//         filterByName(allShows, searchTerm)
//     );
    
//     if (filteredShows.length === 0) { 
//         genres.clear();
//         setGenreSelectors();
//     }
    
//     displayShows(filteredShows);
// }