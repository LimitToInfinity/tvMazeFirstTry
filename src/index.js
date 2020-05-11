import { AppState } from "./appState.js";

import { handleWindowScroll } from "./handleWindowScroll.js";

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

handleWindowScroll();
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
    
    APP_STATE.genres.clear();
    APP_STATE.setGenres(shows);
    APP_STATE.genreSelector.setGenreSelectors();
    
    const sortedShows = sorter[APP_STATE.sortBy.element.value](shows);

    const allPages = createRangeFromTo(1, Math.ceil(shows.length/50));
    APP_STATE.pages.displayPageNumbers(allPages, shows);

    APP_STATE.pages.handleShowsDisplay(sortedShows);
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