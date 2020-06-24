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

export function handleShowCardClick() {
  showCardsContainer.addEventListener("click", displayShowInfo);
}

function displayShowInfo(event) {
  const showInfo = findShowInfo(event.target);
  const isSiteLink = event.target.classList.contains("site-link");
  
  if (showInfo && !isSiteLink) {
    slide(showInfo);
  }
}

function findShowInfo(target) {
  const showCard = target.closest(".show-card");

  return showCard
    ? showCard.querySelector(".show-info")
    : undefined;
}

function slide(showInfo) {
  showInfo.classList.contains("slide-down")
    ? showInfo.classList.remove("slide-down")
    : showInfo.classList.add("slide-down");
}

function createShowCardElements(show) {
  return {
    showCard: makeShowCard(),
    display: show.image ? makeImage(show.image.medium) : makeNoImage(),
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

function makeImage(showImage) {
  const image = createElementWithAttributes("img", {
    src: "https" + showImage.slice(4)
  });
  return addClassesTo(image, "show-image");
}

function makeNoImage() {
  const noImage = createElementWithAttributes("img", {
    src: "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png"
  });
  return addClassesTo(noImage, "show-image");
}
