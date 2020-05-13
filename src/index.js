import { AppState } from "./AppState.js";

import { handleWindowListeners } from "./handleWindowScroll.js";

import { handleShowCardClick } from "./showCard.js";

import { sorter } from "./sort.js";

import {
    createRangeFromTo,
    makeFetchCalls,
    parseAllToJSON,
    flattenResponses
} from "./utilities.js";

const apiShowsPages = createRangeFromTo(0, 0);
const fetchCalls = apiShowsPages.map(makeFetchCalls);

Promise.all(fetchCalls)
    .then(parseAllToJSON)
    .then(flattenResponses)
    .then(setAllShows)
    .then(displayShows);

export const APP_STATE = new AppState();

handleWindowListeners();
handleShowCardClick();

function setAllShows(shows) {
    APP_STATE.setAllShows(shows);
    APP_STATE.setFilteredShows(shows);
    
    document.querySelector(".loading").remove();
    document.querySelector(".pages-container")
        .classList.remove("hidden");

    return APP_STATE.allShows;
}

export function displayShows(shows) {
    scrollViewToTopOfPage();

    removePreviousShowCards();
    
    APP_STATE.genres.clear();
    APP_STATE.setGenres(shows);
    APP_STATE.genreSelector.setGenreSelectors();
    
    APP_STATE.webNetworks.clear();
    APP_STATE.setWebNetworks(shows);
    APP_STATE.webNetworkSelector.setWebNetworkOptions();
    
    const sortedShows = sorter[APP_STATE.sortBy.element.value](shows);

    const allPages = createRangeFromTo(1, Math.ceil(shows.length/50));
    APP_STATE.pages.setPageNumbers(allPages, shows);

    APP_STATE.pages.handleShowsDisplay(sortedShows);
}

function scrollViewToTopOfPage() {
    const isMobile = 
        window.matchMedia('(max-device-width: 600px)').matches;

    isMobile
        ? window.scroll({top: 0})
        : window.scroll({ top: 0, behavior: 'smooth' });
}

function removePreviousShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}