import { createShowInfo } from "./showInfo.js";

import {
  createElement,
  createElementWithAttributes,
  addClassesTo
} from "./utilities.js";

const showCardsContainer = 
  document.querySelector(".show-cards-container");

export function createShowCard(show) {
  const { showCard, display, showInfo } =
    createShowCardElements(show);
  fillAndDisplayShowCard(showCard, display, showInfo);
}

export function handleShowCardEvents() {
  showCardsContainer.addEventListener("mouseover", displayShowTitle);
  showCardsContainer.addEventListener("mouseout", hideShowInfo);
  showCardsContainer.addEventListener("click", hideOrDisplayShowDetails);
}

function displayShowTitle(event) {
  const showTitle = findShowElement(event.target, ".show-title");
  if (showTitle) { slideUp(showTitle); }
}

function hideShowInfo({ target }) {
  const { showTitle, showDetails } = getTitleAndDetails(target);
  if (showTitle
    && !showTitle.classList.contains("no-image")
    && showDetails.classList.contains("slide-down")
  ) { slideDown(showTitle); }
}

function getTitleAndDetails(target) {
  return {
    showTitle: findShowElement(target, ".show-title"),
    showDetails: findShowElement(target, ".show-details")
  };
}

function hideOrDisplayShowDetails(event) {
  const showDetails = findShowElement(event.target, ".show-details");
  if (showDetails) { slideShowDetails(showDetails); }
}

function findShowElement(target, className) {
  const showCard = target.closest(".show-card");
  return showCard
    ? showCard.querySelector(className)
    : undefined;
}

function slideUp(showElement) {
  showElement.classList.remove("slide-down");
}

function slideDown(showElement) {
  showElement.classList.add("slide-down");
}

function slideShowDetails(showDetails) {
  showDetails.classList.contains("slide-down")
    ? showDetails.classList.remove("slide-down")
    : showDetails.classList.add("slide-down");
}

function createShowCardElements(show) {
  return {
    showCard: makeShowCard(),
    display: show.image ? makeImage(show) : makeNoImage(),
    showInfo: createShowInfo(show)
  };
}

function fillAndDisplayShowCard(showCard, display, showInfo) {
  showCard.append(display, showInfo);
  showCardsContainer.append(showCard);
}

function makeShowCard() {
  const showCard = createElement("div");
  return addClassesTo(showCard, "show-card");
}

function makeImage({ image, name }) {
  const imageEl = createElementWithAttributes("img", {
    src: "http" + image.medium.slice(4),
    alt: `${name} poster`
  });
  return addClassesTo(imageEl, "show-image");
}

function makeNoImage() {
  const noImage = createElementWithAttributes("img", {
    src: "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png"
  });
  return addClassesTo(noImage, "show-image");
}
