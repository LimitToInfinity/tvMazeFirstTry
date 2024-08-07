import {
  createElement,
  createElementWithAttributes,
  appendElementsTo,
  addClassesTo
} from "./utilities.js";

export function createShowInfo(show) {
  const { showInfo, name, showDetails } = createShowInfoElements(show);
  return appendElementsTo(showInfo, name, showDetails);
}

function createShowInfoElements(show) {
  return {
    showInfo: makeShowInfoCard(),
    name: makeTitle(show),
    showDetails: createShowDetails(show)
  };
}

function makeShowInfoCard() {
  const showInfo = createElement("div");
  return addClassesTo(showInfo, "show-info");
}

function makeTitle({ name, image }) {
  const title = createElementWithAttributes("h4", {
    textContent: name
  });
  return image
    ? addClassesTo(title, "show-title", "show-detail", "slide-down")
    : addClassesTo(title, "show-title", "show-detail", "no-image");
}

function createShowDetails(show) {
  const {
    showDetails, rating, year, runtime, network, genresDisplayer, officialSite
  } = createShowDetailsElements(show);
  return appendElementsTo(showDetails,
    rating, year, runtime, network, genresDisplayer, officialSite
  );
}

function createShowDetailsElements(show) {
  return {
    showDetails: makeShowDetails(),
    rating: show.rating.average
      ? makeRating(show) : makeNoRating(),
    year: show.premiered ? makeYear(show) : "",
    runtime: show.averageRuntime ? makeRuntime(show) : "",
    network: show.webChannel?.name ? makeNetwork(show) : "",
    genresDisplayer: show.genres.length
      ? makeGenres(show) : makeNoGenres() ,
    officialSite: show.officialSite ? makeOfficialSite(show) : ""
  }
}

function makeShowDetails() {
  const showDetails = createElement("div");
  return addClassesTo(showDetails, "show-details", "slide-down");
}

function makeRating ({ rating }) {
  const ratingEl = createElementWithAttributes("p", {
    textContent: `Rating ${rating.average.toFixed(1)}`
  });
  return addClassesTo(ratingEl, "show-detail");
}

function makeNoRating () {
  const noRating =  createElementWithAttributes("p", {
    textContent: "No Rating"
  });
  return addClassesTo(noRating, "show-detail");
}

function makeYear({ premiered }) {
  const year = createElementWithAttributes("p", {
    textContent: `Premiered ${premiered}`
  });
  return addClassesTo(year, "show-detail");
}

function makeRuntime({ averageRuntime }) {
  const runtimeEl = createElementWithAttributes("p", {
    textContent: `Runtime ${averageRuntime} mins`
  });
  return addClassesTo(runtimeEl, "show-detail");
}

function makeNetwork({ webChannel }) {
  const networkEl = createElementWithAttributes("p", {
    textContent: "On "
  });
  appendNetwork(webChannel.name, networkEl);
  return addClassesTo(networkEl, "show-detail");
}

function appendNetwork(webChannelName, networkEl) {
  const networkNameDisplay = createElementWithAttributes("span", {
    textContent: webChannelName
  });
  appendElementsTo(networkEl,
    addClassesTo(networkNameDisplay, "network-name")
  );
}

function makeNoGenres() {
  const noGenres = createElementWithAttributes("ul", {
    textContent: "No genres"
  });
  return addClassesTo(noGenres, "show-detail");
}

function makeGenres({ genres }) {
  const genresDisplayer = createElementWithAttributes("ul", {
    textContent: genres.length === 1 ? "Genre" : "Genres" 
  });
  return appendAndReturnSortedGenres(genres, genresDisplayer);
}

function appendAndReturnSortedGenres(genres, genresDisplayer) {
  genres.sort()
    .forEach(genre => appendGenre(genresDisplayer, genre));
  return addClassesTo(genresDisplayer, "show-detail");
}

function appendGenre(genresDisplayer, genre) {
  const genreDisplay = createElementWithAttributes("li", {
    textContent: genre
  });
  appendElementsTo(genresDisplayer,
    addClassesTo(genreDisplay, "genre")
  );
}

function makeOfficialSite({ officialSite }) {
  const siteEl = createElementWithAttributes("a", {
    textContent: "Official Site",
    href: officialSite,
    target: "_blank",
    rel: "noopener noreferrer"
  });
  return addClassesTo(siteEl, "site-link");
}
