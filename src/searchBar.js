import { APP_STATE } from "./index.js";

export class SearchBar {
  constructor(cssSelector = "#search-bar") {
    this.element = document.querySelector(cssSelector);
    this.label = this.element.labels[0];

    this.addShrinkClass = this.addShrinkClass.bind(this);
    this.removeShrinkClass = this.removeShrinkClass.bind(this);

    this.element.addEventListener("focus", this.addShrinkClass);
    this.element.addEventListener("blur", this.removeShrinkClass);
    this.element.addEventListener("input", this.filterShows);
  }

  addShrinkClass() {
    this.label.classList.remove("shrink-uncolored");
    this.label.classList.add("shrink-colored");
  }

  removeShrinkClass() {
    if (!this.element.value) {
      this.label.classList.remove("shrink-colored");
      this.label.classList.remove("shrink-uncolored");
    } else {
      this.label.classList.remove("shrink-colored");
      this.label.classList.add("shrink-uncolored");
    }
  }

  filterShows() {
    APP_STATE.setAndDisplayFilteredShows();
  }

  filterByName() {
    return APP_STATE.allShows.filter(show => (
      show.name.toLowerCase()
        .includes(this.element.value.toLowerCase())
    ));
  }
}