import { sorter } from "./sort.js";

import { createShowCard } from "./showCard.js";

import {
    makeFetchCalls,
    createRange,
    flattenResponses,
    parseAllToJSON
} from "./utilities.js";

document.addEventListener("DOMContentLoaded", postLoad);

let searchBar;
let searchBarLabel;

let sortBy;

let genrePillContainer;
let sidebarExpander;

let pagesContainer;
let pages;
let pageSliderForm;
let pageSlider;
let pageSliderOffsetWidth;
let pageSliderMin;
let pageSliderMax;
let pageSliderValue;
let pageSliderOutput;
let pageSliderRangeMax;
let pageNumber = 1;
let pagesToggle;
let pagesToggleImage;

let end;
let start;

let showCardsContainer;

let allShows = [];
let filteredShows = [];

const genres = new Set();
const selectedGenres = new Set();

function postLoad() {
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search-bar]");
    
    sortBy = document.querySelector(".sort-by");
    
    genrePillContainer = document.querySelector(".genre-pills");
    sidebarExpander = document.querySelector(".expander");
    
    pagesContainer = document.querySelector(".pages-container");
    pages = document.querySelector(".pages");
    pageSliderForm = document.querySelector(".page-slider-form");
    pageSlider = pageSliderForm.querySelector("#page-slider");
    pageSliderOutput = pageSliderForm.querySelector("output");
    pageSliderRangeMax = pageSliderForm.querySelector(".range-max");
    pagesToggle = document.querySelector(".pages-toggle");
    pagesToggleImage = pagesToggle.querySelector("i");
    
    showCardsContainer = document.querySelector(".show-cards-container");

    pages.style.display = "none";
    pageSliderMin = pageSlider.min;
    pageSliderMax = pageSlider.max;

    const apiShowsPages = createRange(1);
    const fetchCalls = apiShowsPages.map(makeFetchCalls);

    Promise.all(fetchCalls)
        .then(parseAllToJSON)
        .then(flattenResponses)
        .then(setAllShows)
        .then(displayShows);

    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    searchBar.addEventListener("input", filterShows);
    
    sortBy.addEventListener("change", sortShows);
    
    genrePillContainer.addEventListener("click", handleGenrePill);
    sidebarExpander.addEventListener("click", expandOrContract);
    
    pageSlider.addEventListener("input", handleRangeInput);
    pageSlider.addEventListener("change", handleRangeChange);
    pagesToggle.addEventListener("click", togglePages);
    
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

function sortShows() {
    displayShows(filteredShows);
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

function togglePages() {
    if (pages.style.display === "none") {
        pages.style.display = "flex";
        pageSliderForm.style.display = "none";
        pagesToggleImage.classList.remove("fa-toggle-on");
        pagesToggleImage.classList.add("fa-toggle-off");
    } else {
        pages.style.display = "none";
        pageSliderForm.style.display = "flex";
        handleRangeInput();
        pagesToggleImage.classList.remove("fa-toggle-off");
        pagesToggleImage.classList.add("fa-toggle-on");
    }
}

function handleRangeInput(event) {
    if (!event) { 
        pageSliderValue = pageNumber;
        pageSlider.value = pageSliderValue;
    } else {
        pageSliderValue = event.target.value;
        pageNumber = pageSliderValue;
    }

    pageSliderOffsetWidth = pageSlider.offsetWidth;

    let correctionFactor;
    let offset;
    if (window.matchMedia('(max-device-width: 600px)').matches) {
        correctionFactor = (946/1024);
        offset = -34;
    } else {
        correctionFactor = determineCorrectionFactorDesktop(pageSliderOffsetWidth);
        offset = -10;
    }
    const newPoint = ((pageSliderValue - pageSliderMin)
        / (pageSliderMax - pageSliderMin))
        * correctionFactor;
    const newPlace = (pageSliderOffsetWidth * newPoint) + offset;

    pageSliderOutput.style.left = newPlace + "px";
    pageSliderOutput.textContent = pageSliderValue;
}

function handleRangeChange() {
    displayShows(filteredShows);
}

function determineCorrectionFactorDesktop(pageSliderOffsetWidth) {
    if (pageSliderOffsetWidth < 50) { return (723/1024); }
    else if (pageSliderOffsetWidth < 75) { return (791/1024); }
    else if (pageSliderOffsetWidth < 100) { return (857/1024); }
    else if (pageSliderOffsetWidth < 125) { return (892/1024); }
    else if (pageSliderOffsetWidth < 150) { return (913/1024); }
    else if (pageSliderOffsetWidth < 175) { return (930/1024); }
    else if (pageSliderOffsetWidth < 200) { return (946/1024); }
    else if (pageSliderOffsetWidth < 225) { return (955/1024); }
    else if (pageSliderOffsetWidth < 250) { return (962/1024); }
    else if (pageSliderOffsetWidth < 275) { return (969/1024); }
    else if (pageSliderOffsetWidth < 300) { return (976/1024); }
    else if (pageSliderOffsetWidth < 325) { return (978/1024); }
    else if (pageSliderOffsetWidth < 350) { return (980/1024); }
    else if (pageSliderOffsetWidth < 375) { return (982/1024); }
    else if (pageSliderOffsetWidth < 400) { return (985/1024); }
    else if (pageSliderOffsetWidth < 425) { return (988/1024); }
    else if (pageSliderOffsetWidth < 450) { return (991/1024); }
    else if (pageSliderOffsetWidth < 475) { return (993/1024); }
    else if (pageSliderOffsetWidth < 500) { return (995/1024); }
    else if (pageSliderOffsetWidth < 525) { return (997/1024); }
    else if (pageSliderOffsetWidth < 550) { return (995/1024); }
    else if (pageSliderOffsetWidth < 575) { return (997/1024); }
    else { return (999/1024); }
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

    let selectedGenre = null;
    if (event) {
        selectedGenre = event.target.textContent; 
    }

    if (selectedGenre === "Remove filters!") {
        filteredShows = allShows;
        searchBar.value = "";
        
        selectedGenres.clear();
    } else {
        filteredShows = filterByGenres( filterByName(allShows, searchBar.value) );
    }

    displayShows(filteredShows);
}

function showPageSlider() {
    if (pages.style.display === "flex") {
        pages.style.display = "none";
        pageSliderForm.style.display = "flex";
    }
    handleRangeInput();
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

function filterByName(shows, searchTerm) {
    return shows.filter(show => (
        show.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ));
}

function filterByGenres(shows) {
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

function setGenreSelectors() {
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

function setAllShows(shows) {
    allShows = shows;
    filteredShows = allShows;
    document.querySelector(".loading").remove();

    return allShows;
}

function displayShows(shows) {
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
    setPageNumbers(allPages, shows);

    end = pageNumber * 50;
    start = end - 50;
    if (shows.length < end) { end = shows.length }
    
    checkForNoShows();
    
    const pageText = document.querySelector(".pages-container > h2");
    if (shows.length === 0) {
        createNoShowsText();
        pageText.style.display = "none";
        pageSliderForm.style.display = "none";
        pagesToggle.style.display = "none";
    } else if (shows.length < 51 ) {
        displayPage(sortedShows);
        pageText.style.display = "block";
        pages.style.display = "flex";
        pageSliderForm.style.display = "none";
        pagesToggle.style.display = "none";
    } else {
        displayPage(sortedShows);
        pageText.style.display = "block";
        pagesToggle.style.display = "inline-block";
        if (pages.style.display === "none") {
            pageSliderForm.style.display = "flex";
        }
    }
}

function displayPage(sortedShowsByRating) {
    for (let i = start; i < end; i++) {
        createShowCard(sortedShowsByRating[i]);
    }
}

function setPageNumbers(allPages, shows) {
    clearPreviousPageNumbers();
    createPageNumbers(allPages, shows);

    pageSlider.max = allPages.length;
    pageSliderMax = allPages.length;
    pageSliderRangeMax.textContent = allPages.length;
}

function createPageNumbers(allPages, shows) {
    const pageNumberAsNumber = parseInt(pageNumber, 10)

    let currentPages;
    if (pageNumberAsNumber < 6) {
        currentPages = allPages.slice(0, 9);
    } else if (pageNumberAsNumber > (allPages.length - 5)) {
        currentPages = allPages.slice(-9);
    } else {
        currentPages = allPages.slice( (pageNumberAsNumber - 5), ( pageNumberAsNumber + 4) );
    }

    currentPages.forEach(currentPageNumber => {
        const pageNumberLi = document.createElement("li");
        pageNumberLi.classList.add("page-number");
        pageNumberLi.textContent = currentPageNumber + 1;
        if ( (currentPageNumber + 1) === +pageNumber ) { 
            pageNumberLi.classList.add("selected");
        }

        pages.appendChild(pageNumberLi);

        pageNumberLi.addEventListener("click", (event) => showPageNumber(event, shows));
    });
}

function clearPreviousPageNumbers() {
    const previousPageNumbers = Array.from( document.querySelectorAll(".pages > li") );
    previousPageNumbers.forEach( previousPageNumber => previousPageNumber.remove() );
}

function showPageNumber(event, shows) {
    pageNumber = event.target.textContent;
    handleRangeInput();
    displayShows(shows);
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
