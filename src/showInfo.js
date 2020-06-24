import {
  createElement,
  createElementWithAttributes,
  appendElementsTo,
  addClassesTo
} from "./utilities.js";

export function createShowInfo(show) {
  const { showInfo, name, rating, year, runtime, 
    genresDisplayer, officialSite
  } = createShowInfoElements(show);

  return appendElementsTo(showInfo, name, rating, year,
    runtime, genresDisplayer, officialSite
  );
}

function createShowInfoElements(show) {
  return {
    showInfo: makeShowInfoCard(),
    name: makeName(show),
    rating: show.rating.average
      ? makeRating(show) : makeNoRating(),
    year: show.premiered ? makeYear(show) : "",
    runtime: show.runtime ? makeRuntime(show) : "",
    genresDisplayer: show.genres.length === 0 
      ? makeNoGenres() : makeGenres(show.genres),
    officialSite: show.officialSite ? makeOfficialSite(show) : "",
  };
}

function makeShowInfoCard() {
  const showInfo = createElement("div");
  return addClassesTo(showInfo, "show-info", "slide-down");
}

function makeName(show) {
  const name = createElementWithAttributes("h4", {
    textContent: show.name
  });
  return addClassesTo(name, "show-title", "show-detail");
}

function makeRating (show) {
  const rating = createElementWithAttributes("p", {
    textContent: `Rating ${show.rating.average.toFixed(1)}`
  });

  return addClassesTo(rating, "show-detail");
}

function makeNoRating () {
  const noRating =  createElementWithAttributes("p", {
    textContent: "No Rating"
  });

  return addClassesTo(noRating, "show-detail");
}

function makeYear(show) {
  const year = createElementWithAttributes("p", {
    textContent: `Premiered ${show.premiered}`
  });

  return addClassesTo(year, "show-detail");
}

function makeRuntime(show) {
  const runtime = createElementWithAttributes("p", {
    textContent: `Runtime ${show.runtime} mins`
  });

  return addClassesTo(runtime, "show-detail");
}

function makeNoGenres() {
  const noGenres = createElementWithAttributes("ul", {
    textContent: "No genres"
  });

  return addClassesTo(noGenres, "show-detail");
}

function makeGenres(showGenres) {
  const genresDisplayer = showGenres.length === 1
    ? createElementWithAttributes("ul", { textContent: "Genre" })
    : createElementWithAttributes("ul", { textContent: "Genres" });

  return appendAndReturnSortedGenres(showGenres, genresDisplayer);
}

function appendAndReturnSortedGenres(showGenres, genresDisplayer) {
  showGenres.sort()
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

function makeOfficialSite(show) {
  const site = createElementWithAttributes("a", {
    textContent: "Official Site",
    href: show.officialSite,
    target: "_blank",
    rel: "noopener noreferrer"
  });

  return addClassesTo(site, "site-link");
}
