import {
    pageNumber,
    setPageNumber,
    filteredShows,
    displayShows
} from "./index.js";

export function Pages() {
    const pagesContainer = document.querySelector(".pages-container");
    const pages = document.querySelector(".pages");
    const pageSliderForm = document.querySelector(".page-slider-form");
    const pageSlider = pageSliderForm.querySelector("#page-slider");
    const pageSliderRangeMax = pageSliderForm.querySelector(".range-max");
    const pagesToggle = document.querySelector(".pages-toggle");

    pageSlider.addEventListener("input", handleRangeInput);
    pageSlider.addEventListener("change", () => displayShows(filteredShows));
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

    function showPageNumbers(event, shows) {
        setPageNumber( parseInt(event.target.textContent, 10) );
        handleRangeInput();
        displayShows(shows);
    }

    function displayPageNumbers(allPages, shows) {
        clearPreviousPageNumbers();
        createPageNumbers(allPages, shows);
    
        pageSlider.max = allPages.length;
        pageSliderRangeMax.textContent = allPages.length;
    }
    
    function createPageNumbers(allPages, shows) {
        let currentPages;
        if (pageNumber < 6) {
            currentPages = allPages.slice(0, 9);
        } else if (pageNumber > (allPages.length - 5)) {
            currentPages = allPages.slice(-9);
        } else {
            currentPages = allPages.slice( (pageNumber - 5), ( pageNumber + 4) );
        }
    
        currentPages.forEach(currentPageNumber => {
            const pageNumberLi = document.createElement("li");
            pageNumberLi.classList.add("page-number");
            pageNumberLi.textContent = currentPageNumber + 1;
            if ( (currentPageNumber + 1) === pageNumber ) { 
                pageNumberLi.classList.add("selected");
            }
    
            pages.appendChild(pageNumberLi);
    
            pageNumberLi.addEventListener(
                "click", 
                (event) => showPageNumbers(event, shows)
            );
        });
    }
    
    function clearPreviousPageNumbers() {
        const previousPageNumbers = Array.from( document.querySelectorAll(".pages > li") );
        previousPageNumbers.forEach( previousPageNumber => previousPageNumber.remove() );
    }

    return {
        pagesContainer,
        pages,
        pageSliderForm,
        pagesToggle,
        displayPageNumbers
    }
}

function handleRangeInput(event) {
    const pageSlider = document.querySelector("#page-slider");
    const pageSliderOutput = document.querySelector("output");

    if (!event) { 
        pageSlider.value = pageNumber;
    } else {
        pageSlider.value = event.target.value;
        setPageNumber( parseInt(pageSlider.value, 10) );
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

export function showPageSlider() {
    const pages = document.querySelector(".pages");
    const pageSliderForm = document.querySelector(".page-slider-form");

    if ( !pages.classList.contains("hidden") ) {
        pages.classList.add("hidden");
        pageSliderForm.classList.remove("hidden");
    }
    handleRangeInput();
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