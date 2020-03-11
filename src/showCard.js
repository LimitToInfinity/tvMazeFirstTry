const showCardsContainer = document.querySelector(".show-cards-container");

export default function createShowCard(show) {
    const showCard = makeShowDiv();
    const display = show.image ? makeImage(show) : makeTitle(show);
    const showInfo = createShowInfo(show);

    showCard.append(display, showInfo);
    showCardsContainer.append(showCard);
}

function makeShowDiv() {
    const showCard = document.createElement("div");
    showCard.classList.add("show-card");
    return showCard;
}

function makeImage(show) {
    const image = document.createElement("img");
    image.classList.add("show-image");
    image.src = show.image.medium;
    return image;
}

function makeTitle(show) {
    const title = document.createElement("h3");
    title.classList.add("show-image");
    title.textContent = show.name;
    return title;
}

function createShowInfo(show) {
    const showInfo = makeInfoCard();
    
    const name = makeName(show);
    const rating = show.rating.average
        ? makeRating(show)
        : makeNoRating();
        
    const year = show.premiered ? makeYear(show) : "";
    const runtime = show.runtime ? makeRuntime(show) : "";
    
    const genresDisplayer = document.createElement("ul");
    show.genres.length === 0 
        ? setNoGenres(genresDisplayer)
        : setGenres(show, genresDisplayer);

    const officialSite = show.officialSite
        ? makeOfficialSite(show)
        : "";

    showInfo.append(name, rating, year, runtime, 
        genresDisplayer, officialSite
    );

    return showInfo;
}

function makeInfoCard() {
    const showInfo = document.createElement("div");
    showInfo.classList.add("show-info", "hidden");
    return showInfo;
}

function makeName(show) {
    const name = document.createElement("h4");
    name.classList.add("show-title");
    name.textContent = show.name;
    return name;
}

function makeRating (show) {
    const rating = document.createElement("p");
    rating.textContent = `Rating ${show.rating.average.toFixed(1)}`;
    return rating;
}

function makeNoRating () {
    const rating = document.createElement("p");
    rating.textContent = "No Rating";
    return rating;
}

function makeYear(show) {
    const year = document.createElement("p");
    year.textContent = `Premiered ${show.premiered}`;
    return year;
}

function makeRuntime(show) {
    const runtime = document.createElement("p");
    runtime.textContent = `Runtime ${show.runtime} mins`;
    return runtime;
}

function setNoGenres(genresDisplayer) {
    genresDisplayer.textContent = "No genres";
}

function setGenres(show, genresDisplayer) {
    show.genres.length === 1
        ? genresDisplayer.textContent = "Genre"  
        : genresDisplayer.textContent = "Genres";

    show.genres.sort()
        .map(genre => makeGenres(genresDisplayer, genre));
}

function makeGenres(genresDisplayer, genre) {
    const genreDisplay = document.createElement("li");
    genreDisplay.textContent = genre;
    genresDisplayer.appendChild(genreDisplay);
}

function makeOfficialSite(show) {
    const officialSite = document.createElement("a");
    setOfficialSite(show, officialSite);
    return officialSite;
}

function setOfficialSite(show, officialSite) {
    officialSite.textContent = "Official Site";
    officialSite.href = show.officialSite;
    officialSite.target = "_blank";
    officialSite.rel = "noopener noreferrer";
}