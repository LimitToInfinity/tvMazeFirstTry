import { AppState } from "./AppState.js";

import { handleWindowListeners } from "./handleWindowScroll.js";

import { handleShowCardClick } from "./showCard.js";

import {
    createRangeFromTo,
    fetchShowsPage,
    parseResponsesToJSON,
    flattenResponses
} from "./utilities.js";

const apiShowsPages = createRangeFromTo(0, 191);
const fetchCalls = apiShowsPages.map(fetchShowsPage);

Promise.all(fetchCalls)
    .then(parseResponsesToJSON)
    .then(flattenResponses)
    .then(setAndDisplayAllShows);

export const APP_STATE = new AppState();

handleWindowListeners();
handleShowCardClick();

function setAndDisplayAllShows(shows) {
    APP_STATE.allShows = shows;
    APP_STATE.setAndDisplayFilteredShows();
    
    document.querySelector(".loading").remove();
    document.querySelector(".pages-container")
        .classList.remove("hidden");
}

export function displayShows() {
    scrollViewToTopOfPage();

    removePreviousShowCards();
    
    APP_STATE.genres.clear();
    APP_STATE.setGenres();
    APP_STATE.genreSelector.setGenreSelectors();
    
    APP_STATE.webNetworks.clear();
    APP_STATE.setWebNetworks();
    APP_STATE.webNetworkSelector.setWebNetworkOptions();

    APP_STATE.pages.setPageNumbers();

    APP_STATE.pages.handleShowsDisplay();
}

function scrollViewToTopOfPage() {
    const isMobile = 
        window.matchMedia('(max-device-width: 600px)').matches;

    isMobile
        ? window.scroll( { top: 0 } )
        : window.scroll( { top: 0, behavior: 'smooth' } );
}

function removePreviousShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}