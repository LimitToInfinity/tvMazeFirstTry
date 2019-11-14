const fetchCalls = [];
let searchBar;
let searchBarLabel;
let genreSelector;
let showRange;
let pages;
let pageNumber = 1;
let end;
let start;
let showCardsContainer;
let allShows = [];
let filteredShows = [];
const genres = new Set();
const selectedGenres = new Set();
let selectedGenresUl;

function postLoad() {
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search-bar]");
    genreSelector = document.querySelector(".genre-selector");
    pages = document.querySelector(".pages");
    selectedGenresUl = document.querySelector(".selected-genres");
    showCardsContainer = document.querySelector(".show-cards-container");

    const showsPagesAPI = createRange(100);
    showsPagesAPI.forEach(makeFetchCalls);

    Promise.all(fetchCalls)
        .then(parseAllToJSON)
        .then(flattenResponses)
        .then(setAllShows)
        .then(displayShows);

    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    searchBar.addEventListener("input", filterShows);
    genreSelector.addEventListener("change", filterByGenre);
    selectedGenresUl.addEventListener("click", handleGenre);
}

function filterShows(event) {
    pageNumber = 1;

    const searchTerm = event.target.value;
   
    filteredShows = filterByGenres(
        filterByName(allShows, searchTerm)
    );
    
    if (filteredShows.length === 0) { 
        genres.clear();
        setGenreSelectors();
    }
    
    displayShows(filteredShows);
}

function filterByGenre(event) {
    pageNumber = 1;

    let selectedGenre = null;
    if (event) {
        selectedGenre = event.target.value; 
    }

    showSelectedGenres(selectedGenre);
        
    if (selectedGenre === "show-all" || selectedGenre === "") { 
        filteredShows = allShows;
        searchBar.value = "";
        genreSelector.value = "";
        
        selectedGenres.clear();
    } else {
        filteredShows = filterByGenres( filterByName(allShows, searchBar.value) );
    }

    displayShows(filteredShows);
}

function filterByName(shows, searchTerm) {
    return shows.filter(show => (
        show.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ));
}

function filterByGenres(shows) {
    return shows.filter(show => {
        return Array.from(selectedGenres)
            .every(selectedGenre => show.genres.includes(selectedGenre));
    });
}

function showSelectedGenres(currentSelectedGenre) {
    if (currentSelectedGenre != "show-all"
        && currentSelectedGenre != ""
        && currentSelectedGenre != null)
    { 
        selectedGenres.add(currentSelectedGenre);
    }
    
    clearDisplayedSelectedGenres();
    
    selectedGenres.forEach(selectedGenre => {
        const selectedGenreLi = createSelectedGenre(selectedGenre);
        const deleteImage = createDeleteImage();
        
        selectedGenreLi.append(deleteImage);
        
        selectedGenresUl.append(selectedGenreLi);
    });
}

function createSelectedGenre(selectedGenre) {
    const selectedGenreLi = document.createElement("li");
    selectedGenreLi.classList.add("selected-genre");
    selectedGenreLi.textContent = selectedGenre;

    return selectedGenreLi;
}

function createDeleteImage() {
    const deleteImage = document.createElement("i");
    deleteImage.className = ("fa fa-times");
    deleteImage.classList.add("genre-delete");

    return deleteImage;
}

function handleGenre(event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("selected-genre")) {
        const selectedGenre = clickedElement.textContent;
        removeGenre(selectedGenre);
    } else if (clickedElement.classList.contains("genre-delete")) {
        const selectedGenre = clickedElement.parentNode.textContent;
        removeGenre(selectedGenre);
    }
}

function removeGenre(selectedGenre) {
    selectedGenres.delete(selectedGenre);
    filterByGenre(false);
}

function removeShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}

function setGenreSelectors() {
    const previousSelectors = Array.from(genreSelector.querySelectorAll("option"));
    const previouslyAddedSelectors = previousSelectors.filter(selector => 
        selector.value != ""
        && selector.value != "show-all"
    );

    previouslyAddedSelectors.forEach(selector => selector.remove());

    genres.forEach(createGenreSelectors);
}

function createGenreSelectors(genre) {
    const selector = document.createElement("option");
    selector.classList.add("genre-option");
    selector.value = genre;
    selector.textContent = genre;

    genreSelector.append(selector);
}

function addShrinkClass() {
    // console.log("shrink")
    searchBarLabel.classList.remove("shrink-uncolored");
    searchBarLabel.classList.add("shrink-colored");
}

function removeShrinkClass() {
    if (!searchBar.value) {
        // console.log("unshrink no value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.remove("shrink-uncolored");
    } else {
        // console.log("unshrink value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.add("shrink-uncolored");
    }
}

function setAllShows(shows) {
    allShows = shows.filter(show => show.image);
    filteredShows = allShows;

    return allShows;
}

function displayShows(shows) {
    removeShowCards();

    clearDisplayedSelectedGenresCheck();

    genres.clear();

    const sortedShowsByRating = sortShowsByRating(shows);

    const totalNumberOfPages = createRange(Math.ceil(shows.length/50));
    createPageNumbers(totalNumberOfPages, shows);

    end = pageNumber * 50;
    start = end - 50;
    if (shows.length < end) { end = shows.length }

    checkForNoShows();

    if (shows.length === 0) {
        createNoShowsText();
    } else if (shows.length < 50){
        displayPage(sortedShowsByRating);
    } else {
        displayPage(sortedShowsByRating);
    }
}

function displayPage(sortedShowsByRating) {
    for (let i = start; i < end; i++) {
        createShowCard(sortedShowsByRating[i]);
    }
}

function createPageNumbers(totalNumberOfPages, shows) {
    const previousPageNumbers = Array.from( document.querySelectorAll(".pages > li") );
    previousPageNumbers.forEach( previousPageNumber => previousPageNumber.remove() );

    totalNumberOfPages.slice(0, 10).forEach(pageNumber => {
        const pageNumberLi = document.createElement("li");
        pageNumberLi.classList.add("page-number");
        pageNumberLi.textContent = pageNumber + 1;

        pages.appendChild(pageNumberLi);

        pageNumberLi.addEventListener("click", (event) => showPageNumber(event, shows));
    });
}

function showPageNumber(event, shows) {
    pageNumber = event.target.textContent;
    displayShows(shows);
}

function checkForNoShows() {
    if (showCardsContainer.querySelector(".no-shows")) {
        showCardsContainer.querySelector(".no-shows").remove();
    }
}

function createNoShowsText() {
    const noShows = document.createElement("h2");
    noShows.classList.add("no-shows");
    noShows.textContent = "No shows found!";
    
    showCardsContainer.appendChild(noShows);
}

function clearDisplayedSelectedGenresCheck() {
    if (searchBar.value.length === 0 
        && Array.from(selectedGenres).length === 0)
    {
        clearDisplayedSelectedGenres();
    }
}

function clearDisplayedSelectedGenres() {
    const selectedGenreLis = Array.from(document.querySelectorAll(".selected-genres > li"));
    selectedGenreLis.forEach(selectedGenreLi => selectedGenreLi.remove());
}

function createShowCard(show) {
    setGenres(show)
    setGenreSelectors();

    const showCard = document.createElement("div");
    showCard.classList.add("show-card");

    const image = document.createElement("img");
    image.classList.add("show-image");
    image.src = show.image.medium;

    const showInfo = document.createElement("div");
    showInfo.classList.add("show-info");

    const name = document.createElement("h4");
    name.classList.add("show-title");
    name.textContent = show.name;
    
    const rating = document.createElement("p");
    if (show.rating.average) {
        rating.textContent = "Rating " + show.rating.average.toFixed(1);
    } else {
        rating.textContent = "No Rating";
    }

    const year = document.createElement("p");
    if (show.premiered) {
        year.textContent = "Premiered " + show.premiered.slice(0, 4);
    }

    const runtime = document.createElement("p");
    runtime.textContent = "Runtime " + show.runtime + " mins";

    const officialSite = document.createElement("a");
    officialSite.textContent = "Official Site";
    officialSite.href = show.officialSite;

    showInfo.append(name, rating, year, runtime, officialSite);
    showCard.append(image);
    showCardsContainer.append(showCard);

    showCard.addEventListener("click", () => displayShowInfo(showCard, showInfo));
}

function sortShowsByRating(shows) {
    return shows.sort((a, b) => {
        let ratingA = a.rating.average;
        if (!ratingA) { ratingA = 0; }
        let ratingB = b.rating.average;
        if (!ratingB) { ratingB = 0; }
        
        if (ratingA > ratingB) { return -1; }
        else if (ratingA < ratingB) { return 1; }
        else { return 0; }
    });
}

function setGenres(show) {
    show.genres.forEach(genre => genres.add(genre));
}

function displayShowInfo(showCard, showInfo) {   
    !showCard.querySelector(".show-info")
        ? showCard.append(showInfo)
        : showInfo.remove()
}

function makeFetchCalls(showsPage) {
    const url = `https://api.tvmaze.com/shows?page=${showsPage}`;
    return fetchCalls.push(fetch(url));
}

function createRange(number) {
    return [...Array(number).keys()];
}

function flattenResponses(arrays) {
    return arrays.flat();
}

function parseAllToJSON(responses) {
    return Promise.all(responses.map(parseJSON));
}

function parseJSON(response) {
    return response.json();
}
