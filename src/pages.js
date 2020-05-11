import {
    APP_STATE,
    displayShows
} from "./index.js";

import { createShowCard } from "./showCard.js";

import { createRangeFromTo } from "./utilities.js";

export class Pages {
    constructor() {
        this.isSlider = true;

        this.noShowsFoundText = document
            .querySelector(".no-shows-found");

        this.container = document.querySelector(".pages-container");

        this.pageText = this.container
            .querySelector(".pages-container > h2");
        
        this.pageNumbers = this.container.querySelector(".page-numbers");
        
        this.pageSliderForm = this.container
            .querySelector(".page-slider-form");
        this.pageSliderOutput = this.pageSliderForm
            .querySelector("output");
        this.pageSlider = this.pageSliderForm
            .querySelector("#page-slider");
        this.pageSliderRangeMax = this.pageSliderForm
            .querySelector(".range-max");
        
        this.pagesToggle = this.container.querySelector(".pages-toggle");
        this.pagesToggleImage = this.pagesToggle.querySelector("i");

        this.pageSlider.addEventListener("input", this.handleRangeInput);
        this.pageSlider.addEventListener("change", () => {
            displayShows(APP_STATE.filteredShows)
        });
        this.pagesToggle.addEventListener("click", this.togglePagesView);
    }

    handleRangeInput = (event) => {
        const { pageSlider, pageSliderOutput } = this;

        pageSlider.value = event
            ? event.target.value
            : APP_STATE.pageNumber;
        
        APP_STATE.setPageNumber( parseInt(pageSlider.value, 10) );
       
        const newPosition = this.calculateNewPosition();
    
        pageSliderOutput.style.left = `${newPosition}px`;
        pageSliderOutput.textContent = pageSlider.value;
    }

    togglePagesView = () => {
        this.hideAllPagesContainerChildren();

        this.isSlider
            ? this.displayPageNumbers()
            : this.displayPageSlider();

        this.isSlider = !this.isSlider;
    }

    handleShowsDisplay = (sortedShows) => {
        this.noShowsFoundText.classList.add("hidden");
        this.hideAllPagesContainerChildren();
        
        if (sortedShows.length === 0) {
            this.noShowsFoundText.classList.remove("hidden");
        } else if (sortedShows.length < 51) {
            this.displayPage(sortedShows);
            this.displaySinglePage();
        } else {
            this.displayPage(sortedShows);
            this.displayPagesView();
        }
    }

    displayPage = (sortedShows) => {
        const end = sortedShows.length < (APP_STATE.pageNumber * 50)
            ? sortedShows.length
            : APP_STATE.pageNumber * 50;
        const start = ((end - 50) < 0) ? 0 : (end - 50);
        
        createRangeFromTo( start, (end - 1) ).forEach(number => {
            createShowCard(sortedShows[number]);
        });
    }

    displaySinglePage = () => {
        this.pageText.classList.remove("hidden");
        this.pageNumbers.classList.remove("hidden");
    }

    displayPagesView = () => {
        this.isSlider
            ? this.displayPageSlider()
            : this.displayPageNumbers();
    }

    setPageNumbers = (allPages, shows) => {
        this.clearPreviousPageNumbers();
        this.createPageNumbers(allPages, shows);
        
        this.pageSlider.max = allPages.length;
        this.pageSliderRangeMax.textContent = allPages.length;
    }
    
    clearPreviousPageNumbers = () => {
        const previousPageNumbers = Array.from(
            this.pageNumbers.querySelectorAll("li")
        );
        previousPageNumbers.forEach(
            previousPageNumber => previousPageNumber.remove()
        );
    }
    
    createPageNumbers = (allPages, shows) => {
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
            this.createPageNumber(currentPageNumber, shows);
        });
    }
    
    createPageNumber = (currentPageNumber, shows) => {
        const pageNumberLi = document.createElement("li");
        pageNumberLi.classList.add("page-number");
        pageNumberLi.textContent = currentPageNumber;
        if ( currentPageNumber === APP_STATE.pageNumber ) { 
            pageNumberLi.classList.add("selected");
        }
        pageNumberLi.addEventListener(
            "click", 
            (event) => this.setPage(event, shows)
        );
        
        this.pageNumbers.append(pageNumberLi);
    }
    
    setPage = (event, shows) => {
        APP_STATE.setPageNumber( parseInt(event.target.textContent, 10) );
        this.handleRangeInput();
        displayShows(shows);
    }

    hideAllPagesContainerChildren = () => {
        const pagesContainerElements = Array.from( this.container.children );

        pagesContainerElements.forEach(
            element => element.classList.add("hidden")
        );
    }

    displayPageNumbers = () => {
        this.pageText.classList.remove("hidden");
        this.pageNumbers.classList.remove("hidden");
        this.pagesToggle.classList.remove("hidden");

        this.pagesToggleImage.classList.remove("fa-toggle-on");
        this.pagesToggleImage.classList.add("fa-toggle-off");
    }
    
    displayPageSlider = () => {
        this.pageText.classList.remove("hidden");
        this.pageSliderForm.classList.remove("hidden");
        this.pagesToggle.classList.remove("hidden");

        this.pagesToggleImage.classList.remove("fa-toggle-off");
        this.pagesToggleImage.classList.add("fa-toggle-on");

        this.handleRangeInput();
    }

    calculateNewPosition = () => {
        const { pageSlider } = this;
        
        const isMobile =
            window.matchMedia('(max-device-width: 600px)').matches;

        const correctionFactor = isMobile
            ? (946/1024)
            : determineCorrectionFactorForDesktop(pageSlider.offsetWidth);
        const offset = isMobile ? -34 : -10;
        const newPoint = ( (pageSlider.value - pageSlider.min)
            / (pageSlider.max - pageSlider.min) ) * correctionFactor;
        return (pageSlider.offsetWidth * newPoint) + offset;
    }
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