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

    this.arrowLeft = this.container.querySelector(".arrow.left");
    this.arrowRight = this.container.querySelector(".arrow.right");

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

    this.handlePageArrows = this.handlePageArrows.bind(this);
    this.handleRangeInput = this.handleRangeInput.bind(this);
    this.togglePagesView = this.togglePagesView.bind(this);

    this.arrowLeft.addEventListener("click", this.handlePageArrows);
    this.arrowRight.addEventListener("click", this.handlePageArrows);
    this.pageSlider.addEventListener("input", this.handleRangeInput);
    this.pageSlider.addEventListener("change", displayShows);
    this.pagesToggle.addEventListener("click", this.togglePagesView);
  }

  handlePageArrows(event) {
    const isArrowLeft = event.target.classList.contains('left');
    const isArrowRight = event.target.classList.contains('right');

    if (isArrowLeft) {
      this.setPage(APP_STATE.pageNumber - 1);
    } else if (isArrowRight) {
      this.setPage(APP_STATE.pageNumber + 1);
    }
  }

  handleRangeInput(event) {
    const { pageSlider, pageSliderOutput } = this;

    pageSlider.value = event && event.target.value
      ? event.target.value
      : APP_STATE.pageNumber;

    APP_STATE.pageNumber = parseInt(pageSlider.value, 10);

    const newPosition = this.calculateNewPosition();

    pageSliderOutput.style.left = `${newPosition}px`;
    pageSliderOutput.textContent = pageSlider.value;
  }

  togglePagesView() {
    this.hideAllPagesContainerChildren();

    this.isSlider
      ? this.displayPageNumbers()
      : this.displayPageSlider();

    this.isSlider = !this.isSlider;
  }

  handleShowsDisplay() {
    this.noShowsFoundText.classList.add("hidden");
    this.hideAllPagesContainerChildren();

    if (APP_STATE.filteredShows.length === 0) {
      this.noShowsFoundText.classList.remove("hidden");
    } else if (APP_STATE.filteredShows.length < 51) {
      this.displayPage();
      this.displaySinglePage();
    } else {
      this.displayPage();
      this.displayPagesView();
    }
  }

  displayPage() {
    const end =
      APP_STATE.filteredShows.length < (APP_STATE.pageNumber * 50)
        ? APP_STATE.filteredShows.length
        : APP_STATE.pageNumber * 50;
    const start = ((end - 50) < 0) ? 0 : (end - 50);

    createRangeFromTo( start, (end - 1) ).forEach(number => {
      createShowCard(APP_STATE.filteredShows[number]);
    });
  }

  displaySinglePage() {
    this.pageText.classList.remove("hidden");
    this.pageNumbers.classList.remove("hidden");
  }

  displayPagesView() {
    this.isSlider
      ? this.displayPageSlider()
      : this.displayPageNumbers();
  }

  setPageNumbers() {
    const allPages = createRangeFromTo(
      1,
      Math.ceil(APP_STATE.filteredShows.length/50)
    );

    this.clearPreviousPageNumbers();
    this.createPageNumbers(allPages);

    this.pageSlider.max = allPages.length;
    this.pageSliderRangeMax.textContent = allPages.length;
  }

  clearPreviousPageNumbers() {
    const previousPageNumbers = Array.from(
      this.pageNumbers.querySelectorAll("li")
    );
    previousPageNumbers.forEach(
      previousPageNumber => previousPageNumber.remove()
    );
  }

  createPageNumbers(allPages) {
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
      this.createPageNumber(currentPageNumber);
    });
  }

  createPageNumber(currentPageNumber) {
    const pageNumberLi = document.createElement("li");
    pageNumberLi.classList.add("page-number");
    pageNumberLi.textContent = currentPageNumber;
    if ( currentPageNumber === APP_STATE.pageNumber ) { 
      pageNumberLi.classList.add("selected");
    }
    pageNumberLi.addEventListener(
      "click", 
      (event) => this.setPage(parseInt(event.target.textContent, 10))
    );

    this.pageNumbers.append(pageNumberLi);
  }

  setPage(newPageNumber) {
    APP_STATE.pageNumber = newPageNumber;
    this.handleRangeInput();
    displayShows();
  }

  hideAllPagesContainerChildren() {
    const pagesContainerChildren = Array.from(this.container.children)
      .filter(child => !child.classList.contains('arrow'));

    pagesContainerChildren.forEach(
      element => element.classList.add("hidden")
    );
  }

  displayPageSlider() {
    this.pageText.classList.remove("hidden");
    this.pageSliderForm.classList.remove("hidden");
    this.pagesToggle.classList.remove("hidden");

    this.pagesToggleImage.classList.remove("fa-toggle-off");
    this.pagesToggleImage.classList.add("fa-toggle-on");

    this.handleRangeInput();
  }

  displayPageNumbers() {
    this.pageText.classList.remove("hidden");
    this.pageNumbers.classList.remove("hidden");
    this.pagesToggle.classList.remove("hidden");

    this.pagesToggleImage.classList.remove("fa-toggle-on");
    this.pagesToggleImage.classList.add("fa-toggle-off");
  }

  calculateNewPosition() {
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