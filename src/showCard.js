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
  const { classList, nextElementSibling } = event.target;

  if (classList.contains("show-image")) {
    nextElementSibling.classList.contains("hidden")
      ? nextElementSibling.classList.remove("hidden")
      : nextElementSibling.classList.add("hidden");
  }
}

function createShowCardElements(show) {
  return {
    showCard: makeShowCard(),
    display: show.image ? makeImage(show) : makeTitle(show),
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

function makeImage(show) {
  const image = createElementWithAttributes("img", {
    src: "https" + show.image.medium.slice(4)
  });
  return addClassesTo(image, "show-image");
}

function makeTitle(show) {
  const title = createElementWithAttributes("h3", {
    textContent: show.name
  });
  return addClassesTo(title, "show-image");
}
