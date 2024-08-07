import { AppState } from "./appState.js";

import { handleWindowListeners } from "./handleWindowScroll.js";

import { handleShowCardEvents } from "./showCard.js";

import {
  createRangeFromTo,
  fetchShowsPage,
  parseResponsesToJSON,
  flattenResponses
} from "./utilities.js";

export const APP_STATE = new AppState();

let firstPage = 0;
let lastPage = 25;
const pageIncrement = 25;

function makeFetchCalls() {
  const portionOfApiShowsPages = createRangeFromTo(firstPage, lastPage);
  const fetchCalls = portionOfApiShowsPages.map(fetchShowsPage);

  Promise.all(fetchCalls)
    .then(parseResponsesToJSON)
    .then(flattenResponses)
    .then(setAndDisplayAllShows)
    .then(ifMorePagesMakeFetchCalls);
}

makeFetchCalls();

handleWindowListeners();
handleShowCardEvents();

function setAndDisplayAllShows(shows) {
  APP_STATE.allShows = [...APP_STATE.allShows, ...shows];
  APP_STATE.setAndDisplayFilteredShows();

  const loadingGif = document.querySelector(".loading");
  if (loadingGif) {
    loadingGif.remove();
    loadingGif.classList.add('form-mini-loading');
    document.querySelector('.page-slider-form').append(loadingGif);
    document.querySelector(".pages-container")
      .classList.remove("hidden");
  }
}

function ifMorePagesMakeFetchCalls() {
  firstPage += pageIncrement;
  lastPage += pageIncrement;

  APP_STATE.isLastPageNoMoreShowsHit
    ? document.querySelector(".loading").remove()
    : makeFetchCalls();
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