import { handleWindowScroll } from "./handleWindowScroll.js";

import {
    genres,
    setGenres,
    GenreSelector,
    setGenreSelectors
} from "./genreSelector.js";

import { SearchBar } from "./searchBar.js";

import { SortBy } from "./sortBy.js";
import { sorter } from "./sort.js";

import {
    Pages,
    handleShowsDisplay,
    displayPageNumbers
} from "./pages.js";

import { handleShowCardClick } from "./showCard.js";

import {
    makeFetchCalls,
    createRangeFromTo,
    flattenResponses,
    parseAllToJSON
} from "./utilities.js";

const apiShowsPages = createRangeFromTo(0, 3);
const fetchCalls = apiShowsPages.map(makeFetchCalls);

Promise.all(fetchCalls)
    .then(parseAllToJSON)
    .then(flattenResponses)
    .then(setAllShows)
    .then(displayShows);

handleWindowScroll();
GenreSelector();
SearchBar();
const sortBy = SortBy(".sort-by");
Pages();
handleShowCardClick();

export let pageNumber = 1;
export const setPageNumber = (newNumber) => pageNumber = newNumber;

export let allShows = [];
export let filteredShows = [];
export const setFilteredShows = (shows) => filteredShows = shows;

function setAllShows(shows) {
    allShows = shows;
    filteredShows = allShows;
    
    document.querySelector(".loading").remove();

    return allShows;
}

export function displayShows(shows) {
    scrollViewToTopOfPage()
    
    removeShowCards();
    
    genres.clear();
    setGenres(shows);
    setGenreSelectors();
    
    const sortedShows = sorter[sortBy.value](shows);

    const allPages = createRangeFromTo(1, Math.ceil(shows.length/50));
    displayPageNumbers(allPages, shows);

    handleShowsDisplay(sortedShows);
}

function scrollViewToTopOfPage() {
    if (!window.matchMedia('(max-device-width: 600px)').matches) {
        window.scroll({ top: 0, behavior: 'smooth' });
    } else if (window.matchMedia('(max-device-width: 600px)').matches) {
        window.scroll({top: 0});
    }
}

function removeShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}