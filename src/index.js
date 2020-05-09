import { SearchBar } from "./searchBar.js";

import { SortBy } from "./sortBy.js";
import { sorter } from "./sort.js";

import { Pages, showPageSlider } from "./pages.js";

import { createShowCard } from "./showCard.js";

import {
    makeFetchCalls,
    createRange,
    flattenResponses,
    parseAllToJSON
} from "./utilities.js";

document.addEventListener("DOMContentLoaded", postLoad);

let genrePillContainer;
let sidebarExpander;

const searchBar = SearchBar("#search-bar");

const sortBy = SortBy(".sort-by");

const {
    pagesContainer,
    pages,
    pageSliderForm,
    pagesToggle,
    displayPageNumbers
} = Pages();

export let pageNumber = 1;
export const setPageNumber = (newNumber) => pageNumber = newNumber;
let end;
let start;

let showCardsContainer;

export let allShows = [];
export let filteredShows = [];
export const setFilteredShows = (shows) => filteredShows = shows;

export const genres = new Set();
const selectedGenres = new Set();

function postLoad() {
    genrePillContainer = document.querySelector(".genre-pills");
    sidebarExpander = document.querySelector(".expander");
    
    showCardsContainer = document.querySelector(".show-cards-container");

    const apiShowsPages = createRange(190);
    const fetchCalls = apiShowsPages.map(makeFetchCalls);

    Promise.all(fetchCalls)
        .then(parseAllToJSON)
        .then(flattenResponses)
        .then(setAllShows)
        .then(displayShows);

    searchBar.addEventListener("input", filterShows);
    
    genrePillContainer.addEventListener("click", handleGenrePill);
    sidebarExpander.addEventListener("click", expandOrContract);
    
    window.addEventListener("scroll", handleScroll);
    
    showCardsContainer.addEventListener("click", displayShowInfo);
}

function displayShowInfo(event) {
    const { classList, nextElementSibling } = event.target;
    
    if (classList.contains("show-image")) {
        nextElementSibling.classList.contains("hidden")
            ? nextElementSibling.classList.remove("hidden")
            : nextElementSibling.classList.add("hidden");
    }
}

function handleScroll() {
    if (window.matchMedia('(max-device-width: 600px)').matches) {
        if (window.scrollY < 1800) {
            showCardsContainer.prepend(pagesContainer);
        } else if (window.scrollY > 2200 && window.scrollY < 3000) {
            pagesContainer.remove();
        } else if (window.scrollY > 3400) {
            showCardsContainer.append(pagesContainer);
        }
    } else {
        if (window.scrollY < 700) {
            showCardsContainer.prepend(pagesContainer);
        } else if (window.scrollY > 850 && window.scrollY < 1450) {
            pagesContainer.remove();
        } else if (window.scrollY > 1600) {
            showCardsContainer.append(pagesContainer);
        }
    }
}

function filterShows(event) {
    pageNumber = 1;
    showPageSlider();
    
    const searchTerm = event.target.value;
   
    filteredShows = filterByGenres(
        filterByName(allShows, searchTerm)
    );
    
    if (filteredShows.length === 0) { 
        genres.clear();
        setGenreSelectors();
    }
    
    displayShows(filteredShows);
}

function filterByGenre(event) {
    pageNumber = 1;
    showPageSlider();

    const selectedGenre = event ? event.target.textContent : undefined;

    if (selectedGenre === "Remove filters!") {
        filteredShows = allShows;
        searchBar.value = "";
        
        selectedGenres.clear();
    } else {
        filteredShows = filterByGenres( filterByName(allShows, searchBar.value) );
    }

    displayShows(filteredShows);
}

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
    const genrePillHeader = genrePillContainer.querySelector(".genre-pill-header");
    const sidebarExpander = genrePillContainer.querySelector(".expander");
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

export function filterByName(shows, searchTerm) {
    return shows.filter(show => (
        show.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ));
}

export function filterByGenres(shows) {
    const allGenres = Array.from(selectedGenres);
    return shows.filter(show => {
        return allGenres
            .every(selectedGenre => show.genres.includes(selectedGenre));
    });
}

function removeShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}

export function setGenreSelectors() {
    const previousPills = Array.from(genrePillContainer.querySelectorAll("li"));
    const previouslyAddedPills = previousPills.filter(selector => 
        !selector.textContent.includes("Filter by genre(s)!")
        && selector.textContent !== "Remove filters!"
    );

    previouslyAddedPills.forEach(pill => pill.remove());

    Array.from(genres).filter(genre => selectedGenres.has(genre)).sort().forEach(createGenreSelector);
    Array.from(genres).filter(genre => !selectedGenres.has(genre)).sort().forEach(createGenreSelector);
}

function createGenreSelector(genre) {
    const selector = document.createElement("li");
    selector.classList.add("genre-pill");
    selector.textContent = genre;
    
    genrePillContainer.append(selector);
    
    if (selectedGenres.has(genre)) {
        selector.classList.add("highlighted");
    }
}

function setAllShows(shows) {
    allShows = shows;
    filteredShows = allShows;
    
    document.querySelector(".loading").remove();

    return allShows;
}

export function displayShows(shows) {
    if (!window.matchMedia('(max-device-width: 600px)').matches) {
        window.scroll({ top: 0, behavior: 'smooth' });
    } else if (window.matchMedia('(max-device-width: 600px)').matches) {
        window.scroll({top: 0});
    }

    removeShowCards();

    genres.clear();
    setGenres(shows);
    setGenreSelectors();

    const sortedShows = sorter[sortBy.value](shows);

    const allPages = createRange(Math.ceil(shows.length/50));
    displayPageNumbers(allPages, shows);

    end = pageNumber * 50;
    start = end - 50;
    if (shows.length < end) { end = shows.length }
    
    checkForNoShows();
    
    const pageText = document.querySelector(".pages-container > h2");
    if (shows.length === 0) {
        createNoShowsText();
        pageText.classList.add("hidden");
        pageSliderForm.classList.add("hidden");
        pagesToggle.classList.add("hidden");
    } else if (shows.length < 51 ) {
        displayPage(sortedShows);
        pageText.classList.remove("hidden");
        pages.classList.remove("hidden");
        pageSliderForm.classList.add("hidden");
        pagesToggle.classList.add("hidden");
    } else {
        displayPage(sortedShows);
        pageText.classList.remove("hidden");
        pagesToggle.classList.remove("hidden");
        if ( pages.classList.contains("hidden") ) {
            pageSliderForm.classList.remove("hidden");
        }
    }
}

function displayPage(sortedShowsByRating) {
    for (let i = start; i < end; i++) {
        createShowCard(sortedShowsByRating[i]);
    }
}

function checkForNoShows() {
    if (showCardsContainer.querySelector(".no-shows")) {
        showCardsContainer.querySelector(".no-shows").remove();
    }
}

function createNoShowsText() {
    const noShows = document.createElement("h2");
    noShows.classList.add("no-shows");
    noShows.textContent = "No shows found!";
    
    showCardsContainer.appendChild(noShows);
}

function setGenres(shows) {
    shows.forEach(show => show.genres.forEach(genre => genres.add(genre)));
}
