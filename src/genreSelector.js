import {
    setPageNumber,
    filteredShows,
    setFilteredShows,
    allShows,
    displayShows
} from "./index.js";

import {
    searchBar,
    filterByName
} from "./searchBar.js";

import { showPageSlider } from "./pages.js";

export const genres = new Set();
export const setGenres = (shows) => {
    shows.forEach(show => show.genres.forEach(genre => genres.add(genre)));
}
const selectedGenres = new Set();

export function GenreSelector() {

    const genrePillContainer = document.querySelector(".genre-pills");
    const sidebarExpander = document.querySelector(".expander");
    
    genrePillContainer.addEventListener("click", handleGenrePill);
    sidebarExpander.addEventListener("click", expandOrContract);

    function handleGenrePill(event) {
        const { textContent, classList } = event.target;
    
        if (
            classList.contains("genre-pill")
            && classList.contains("highlighted")
        ) {
            classList.remove("highlighted");
            selectedGenres.delete(textContent, classList);
            filterByGenre(event);
    
        } else if (
            classList.contains("genre-pill")
            && textContent !== "Remove filters!"
        ) {
            classList.add("highlighted");
            selectedGenres.add(textContent);
            filterByGenre(event);
    
        } else if (textContent === "Remove filters!") {
            filterByGenre(event);
    
        } else if (
            classList.contains("expander")
            || classList.contains("genre-pill-header")
            || classList.contains("genre-pill-header-text")
            || classList.contains("fold")
        ) {
            expandOrContract();
    
        } else if (!classList.contains("genre-pill")) {
            return;
    
        }
    }
    
    function expandOrContract() {
        const genrePillHeader = genrePillContainer
            .querySelector(".genre-pill-header");
        const sidebarExpander = genrePillContainer
            .querySelector(".expander");
        const headerExpander = document.querySelector("header > .expander");
        
        const bars = Array.from( sidebarExpander.querySelectorAll("span") )
            .concat( Array.from( headerExpander.querySelectorAll("span") ) );
        bars.forEach(bar => bar.classList.toggle("fold"));
    
        if (genrePillContainer.classList.contains("collapsed")) {
            genrePillContainer.classList.remove("collapsed");
            genrePillContainer.classList.add("expanded");
    
            genrePillHeader.classList.remove("bottom-sheet");
            if (window.matchMedia('(max-device-width: 600px)').matches) {
                genrePillHeader.style.fontSize = "6rem";
            }
    
        } else if (genrePillContainer.classList.contains("expanded")) {
            genrePillContainer.classList.remove("expanded");
            genrePillContainer.classList.add("collapsed");
            
            genrePillHeader.classList.add("bottom-sheet");
            if (window.matchMedia('(max-device-width: 600px)').matches) {
                genrePillHeader.style.fontSize = "3rem";
            }
    
        }
    }

    function filterByGenre(event) {
        setPageNumber(1);
        showPageSlider();
    
        const selectedGenre = event ? event.target.textContent : undefined;
    
        if (selectedGenre === "Remove filters!") {
            setFilteredShows(allShows);
            searchBar.value = "";
            
            selectedGenres.clear();
        } else {
            setFilteredShows(
                filterByGenres(
                    filterByName(allShows, searchBar.value)
                )
            );
        }

        displayShows(filteredShows);
    }
}

export function filterByGenres(shows) {
    const allGenres = Array.from(selectedGenres);
    return shows.filter(show => {
        return allGenres
            .every(selectedGenre => show.genres.includes(selectedGenre));
    });
}

export function setGenreSelectors() {
    const previousPills = Array.from(
        document.querySelectorAll(".genre-pills > li")
    );
    const previouslyAddedPills = previousPills.filter(selector =>
        !selector.textContent.includes("Filter by genre(s)!")
        && selector.textContent !== "Remove filters!"
    );

    previouslyAddedPills.forEach(pill => pill.remove());

    Array.from(selectedGenres)
        .forEach(createGenreSelector);
    Array.from(genres)
        .filter(genre => !selectedGenres.has(genre))
        .sort()
        .forEach(createGenreSelector);
}

function createGenreSelector(genre) {
    const selector = document.createElement("li");
    selector.classList.add("genre-pill");
    selector.textContent = genre;
    if (selectedGenres.has(genre)) {
        selector.classList.add("highlighted");
    }
    
    document.querySelector(".genre-pills").append(selector);
}