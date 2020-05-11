import { AppState } from "./appState.js";

import { handleWindowScroll } from "./handleWindowScroll.js";

import {
    genres,
    setGenres,
    GenreSelector,
    setGenreSelectors
} from "./genreSelector.js";

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

const apiShowsPages = createRangeFromTo(0, 0);
const fetchCalls = apiShowsPages.map(makeFetchCalls);

Promise.all(fetchCalls)
    .then(parseAllToJSON)
    .then(flattenResponses)
    .then(setAllShows)
    .then(displayShows);

export const APP_STATE = new AppState();

handleWindowScroll();
GenreSelector();
const sortBy = SortBy(".sort-by");
Pages();
handleShowCardClick();

function setAllShows(shows) {
    APP_STATE.setAllShows(shows);
    APP_STATE.setFilteredShows(shows);
    
    document.querySelector(".loading").remove();

    return APP_STATE.allShows;
}

export function displayShows(shows) {
    scrollViewToTopOfPage();
    
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