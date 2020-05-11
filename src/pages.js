import {
    APP_STATE,
    displayShows
} from "./index.js";

import { createShowCard } from "./showCard.js";

import { createRangeFromTo } from "./utilities.js";

export class Pages {
    constructor() {
        this.pageText = document.querySelector(".pages-container > h2");
        
        this.pageNumbers = document.querySelector(".page-numbers");
        
        this.pageSliderForm = document.querySelector(".page-slider-form");
        this.pageSliderOutput = this.pageSliderForm
            .querySelector("output");
        this.pageSlider = this.pageSliderForm.querySelector("#page-slider");
        this.pageSliderRangeMax = this.pageSliderForm
            .querySelector(".range-max");
        
        this.pagesToggle = document.querySelector(".pages-toggle");
        this.pagesToggleImage = this.pagesToggle.querySelector("i");

        this.pageSlider.addEventListener("input", this.handleRangeInput);
        this.pageSlider.addEventListener("change", () => {
            displayShows(APP_STATE.filteredShows)
        });
        this.pagesToggle.addEventListener("click", this.togglePages);
    }

    handleRangeInput = (event) => {
        const { pageSlider, pageSliderOutput } = this;

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
            correctionFactor = determineCorrectionFactorForDesktop(
                pageSlider.offsetWidth
            );
            offset = -10;
        }
        const newPoint = ((pageSlider.value - pageSlider.min)
            / (pageSlider.max - pageSlider.min))
            * correctionFactor;
        const newPlace = (pageSlider.offsetWidth * newPoint) + offset;
    
        pageSliderOutput.style.left = `${newPlace}px`;
        pageSliderOutput.textContent = pageSlider.value;
    }

    togglePages = () => {
        const { pageNumbers, pageSliderForm } = this;

        if ( pageNumbers.classList.contains("hidden") ) {
            pageNumbers.classList.remove("hidden");
            pageSliderForm.classList.add("hidden");
            this.togglePagesToggleImage();
        } else {
            pageNumbers.classList.add("hidden");
            pageSliderForm.classList.remove("hidden");
            this.handleRangeInput();
            this.togglePagesToggleImage();
        }
    }

    togglePagesToggleImage = () => {    
        this.pagesToggleImage.classList.toggle("fa-toggle-on");
        this.pagesToggleImage.classList.toggle("fa-toggle-off");
    }

    showPageSlider = () => {
        const { pageNumbers, pageSliderForm } = this;
    
        if ( !pageNumbers.classList.contains("hidden") ) {
            pageNumbers.classList.add("hidden");
            pageSliderForm.classList.remove("hidden");
        }
        this.handleRangeInput();
    }
    
    handleShowsDisplay = (sortedShows) => {
        const {
            pageText,
            pageNumbers,
            pageSliderForm,
            pagesToggle,
            pagesToggleImage
        } = this;
    
        this.checkForNoShows();
        
        if (sortedShows.length === 0) {
            this.createNoShowsText();
            
            pageText.classList.add("hidden");
            pageSliderForm.classList.add("hidden");
            pagesToggle.classList.add("hidden");
        } else if (sortedShows.length < 51) {
            this.displayPage(sortedShows);
            
            pageText.classList.remove("hidden");
            pageNumbers.classList.remove("hidden");
            pageSliderForm.classList.add("hidden");
            pagesToggle.classList.add("hidden");
        } else {
            this.displayPage(sortedShows);
            
            pageText.classList.remove("hidden");
            pagesToggle.classList.remove("hidden");
            
            if ( pageNumbers.classList.contains("hidden") ) {
                pageSliderForm.classList.remove("hidden");
            }
    
            if (
                pagesToggleImage.classList.contains("fa-toggle-off")
                && !pageSliderForm.classList.contains("hidden")
            ) {
                pagesToggleImage.classList.remove("fa-toggle-off");
                pagesToggleImage.classList.add("fa-toggle-on");
            }
        }
    }
    
    displayPageNumbers = (allPages, shows) => {
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
            (event) => this.showPageNumbers(event, shows)
        );
        
        this.pageNumbers.append(pageNumberLi);
    }
    
    showPageNumbers = (event, shows) => {
        APP_STATE.setPageNumber( parseInt(event.target.textContent, 10) );
        this.handleRangeInput();
        displayShows(shows);
    }
    
    checkForNoShows = () => {
        if (document.querySelector(".no-shows")) {
            document.querySelector(".no-shows").remove();
        }
    }
    
    createNoShowsText = () => {
        const noShows = document.createElement("h2");
        noShows.classList.add("no-shows");
        noShows.textContent = "No shows found!";
        
        document.querySelector(".show-cards-container").append(noShows);
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