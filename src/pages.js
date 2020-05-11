import {
    APP_STATE,
    displayShows
} from "./index.js";

import { createShowCard } from "./showCard.js";

import { createRangeFromTo } from "./utilities.js";

export function Pages() {
    const pages = document.querySelector(".pages");
    const pageSliderForm = document.querySelector(".page-slider-form");
    const pageSlider = pageSliderForm.querySelector("#page-slider");
    const pagesToggle = document.querySelector(".pages-toggle");

    pageSlider.addEventListener("input", handleRangeInput);
    pageSlider.addEventListener("change", () => {
        displayShows(APP_STATE.filteredShows)
    });
    pagesToggle.addEventListener("click", togglePages);

    function togglePages() {
        if ( pages.classList.contains("hidden") ) {
            pages.classList.remove("hidden");
            pageSliderForm.classList.add("hidden");
            togglePagesToggleImage();
        } else {
            pages.classList.add("hidden");
            pageSliderForm.classList.remove("hidden");
            handleRangeInput();
            togglePagesToggleImage();
        }
    }
}

export function showPageSlider() {
    const pages = document.querySelector(".pages");
    const pageSliderForm = document.querySelector(".page-slider-form");

    if ( !pages.classList.contains("hidden") ) {
        pages.classList.add("hidden");
        pageSliderForm.classList.remove("hidden");
    }
    handleRangeInput();
}

export function handleShowsDisplay(sortedShows) {
    const pages = document.querySelector(".pages");
    const pageSliderForm = document.querySelector(".page-slider-form");
    const pagesToggle = document.querySelector(".pages-toggle");

    checkForNoShows();
    
    const pageText = document.querySelector(".pages-container > h2");
    if (sortedShows.length === 0) {
        createNoShowsText();
        
        pageText.classList.add("hidden");
        pageSliderForm.classList.add("hidden");
        pagesToggle.classList.add("hidden");
    } else if (sortedShows.length < 51) {
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

        const pagesToggleImage = pagesToggle.querySelector("i");
        if ( pagesToggleImage.classList.contains("fa-toggle-off") ) {
            pagesToggleImage.classList.remove("fa-toggle-off");
            pagesToggleImage.classList.add("fa-toggle-on");
        }
    }
}

export function displayPageNumbers(allPages, shows) {
    clearPreviousPageNumbers();
    createPageNumbers(allPages, shows);
    
    const pageSlider = document.querySelector("#page-slider");
    pageSlider.max = allPages.length;
    
    const pageSliderRangeMax = document.querySelector(".range-max");
    pageSliderRangeMax.textContent = allPages.length;
}

function clearPreviousPageNumbers() {
    const previousPageNumbers = Array.from( document.querySelectorAll(".pages > li") );
    previousPageNumbers.forEach( previousPageNumber => previousPageNumber.remove() );
}

function createPageNumbers(allPages, shows) {
    let currentPages;
    if (APP_STATE.pageNumber < 6) {
        currentPages = allPages.slice(0, 9);
    } else if (APP_STATE.pageNumber > (allPages.length - 5)) {
        currentPages = allPages.slice(-9);
    } else {
        currentPages = allPages.slice(
            (APP_STATE.pageNumber - 5), ( APP_STATE.pageNumber + 4)
        );
    }

    currentPages.forEach(currentPageNumber => {
        createPageNumber(currentPageNumber, shows);
    });
}

function createPageNumber(currentPageNumber, shows) {
    const pageNumberLi = document.createElement("li");
    pageNumberLi.classList.add("page-number");
    pageNumberLi.textContent = currentPageNumber;
    if ( currentPageNumber === APP_STATE.pageNumber ) { 
        pageNumberLi.classList.add("selected");
    }
    pageNumberLi.addEventListener(
        "click", 
        (event) => showPageNumbers(event, shows)
    );
    
    const pages = document.querySelector(".pages");
    pages.appendChild(pageNumberLi);
}

function showPageNumbers(event, shows) {
    APP_STATE.setPageNumber( parseInt(event.target.textContent, 10) );
    handleRangeInput();
    displayShows(shows);
}

function checkForNoShows() {
    const showCardsContainer = document.querySelector(".show-cards-container");
    if (showCardsContainer.querySelector(".no-shows")) {
        showCardsContainer.querySelector(".no-shows").remove();
    }
}

function createNoShowsText() {
    const noShows = document.createElement("h2");
    noShows.classList.add("no-shows");
    noShows.textContent = "No shows found!";
    
    document.querySelector(".show-cards-container")
        .appendChild(noShows);
}

function displayPage(sortedShows) {
    const end = sortedShows.length < (APP_STATE.pageNumber * 50)
        ? sortedShows.length
        : APP_STATE.pageNumber * 50;
    const start = ((end - 50) < 0) ? 0 : (end - 50);
    
    createRangeFromTo( start, (end - 1) ).forEach(number => {
        createShowCard(sortedShows[number]);
    });
}

function handleRangeInput(event) {
    const pageSlider = document.querySelector("#page-slider");
    const pageSliderOutput = document.querySelector("output");

    if (!event) { 
        pageSlider.value = APP_STATE.pageNumber;
    } else {
        pageSlider.value = event.target.value;
        APP_STATE.setPageNumber( parseInt(pageSlider.value, 10) );
    }

    let correctionFactor;
    let offset;
    if (window.matchMedia('(max-device-width: 600px)').matches) {
        correctionFactor = (946/1024);
        offset = -34;
    } else {
        correctionFactor = determineCorrectionFactorForDesktop(pageSlider.offsetWidth);
        offset = -10;
    }
    const newPoint = ((pageSlider.value - pageSlider.min)
        / (pageSlider.max - pageSlider.min))
        * correctionFactor;
    const newPlace = (pageSlider.offsetWidth * newPoint) + offset;

    pageSliderOutput.style.left = `${newPlace}px`;
    pageSliderOutput.textContent = pageSlider.value;
}

function togglePagesToggleImage() {
    const pagesToggleImage = document.querySelector(".pages-toggle > i");

    pagesToggleImage.classList.toggle("fa-toggle-on");
    pagesToggleImage.classList.toggle("fa-toggle-off");
}

function determineCorrectionFactorForDesktop(pageSliderOffsetWidth) {
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