const fetchCalls = [];
let searchBar;
let searchBarLabel;
let sortBy;
let genrePillContainer;
let showRange;
let pagesContainer;
let pages;
let pageSliderForm;
let pageSlider;
let pageSliderOffsetWidth;
let pageSliderMin;
let pageSliderMax;
let pageSliderValue;
let pageSliderOutput;
let pageSliderRangeMax;
let pageNumber = 1;
let pagesToggle;
let pagesToggleImage;
let end;
let start;
let showCardsContainer;
let allShows = [];
let filteredShows = [];
const genres = new Set();
const selectedGenres = new Set();

function postLoad() {
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search-bar]");
    sortBy = document.querySelector(".sort-by");
    genrePillContainer = document.querySelector(".genre-pills");
    pagesContainer = document.querySelector(".pages-container");
    pages = document.querySelector(".pages");
    pageSliderForm = document.querySelector(".page-slider-form");
    pageSlider = pageSliderForm.querySelector("#page-slider");
    pageSliderOutput = pageSliderForm.querySelector("output");
    pageSliderRangeMax = pageSliderForm.querySelector(".range-max");
    pagesToggle = document.querySelector(".pages-toggle");
    pagesToggleImage = pagesToggle.querySelector("i");
    showCardsContainer = document.querySelector(".show-cards-container");

    pages.style.display = "none";
    pageSliderMin = pageSlider.min;
    pageSliderMax = pageSlider.max;
    genrePillContainer.style.maxHeight = "5rem";

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
    sortBy.addEventListener("change", sortShows);
    genrePillContainer.addEventListener("click", handleGenrePill);
    pageSlider.addEventListener("input", handleRangeInput);
    pageSlider.addEventListener("change", handleRangeChange);
    pagesToggle.addEventListener("click", togglePages);
    window.addEventListener("scroll", handleScroll);
}

function sortShows() {
    displayShows(filteredShows);
}

const sorter = {
    "rating"(shows){ return sortShowsByRating(sortShowsByPremiered(sortShowsByName(shows))); },
    "premiered"(shows){ return sortShowsByPremiered(sortShowsByRating(sortShowsByName(shows))); },
    "name"(shows){ return sortShowsByName(sortShowsByRating(sortShowsByPremiered(shows))); },
}

function handleScroll() {
    if (window.scrollY < 700) {
        showCardsContainer.prepend(pagesContainer);
    } else if (window.scrollY > 700 && window.scrollY < 1600) {
        pagesContainer.remove();
    } else if (window.scrollY > 1600) {
        showCardsContainer.append(pagesContainer);
    }
}

function togglePages() {
    if (pages.style.display === "none") {
        pages.style.display = "flex";
        pageSliderForm.style.display = "none";
        pagesToggleImage.classList.remove("fa-toggle-on");
        pagesToggleImage.classList.add("fa-toggle-off");
    } else {
        pages.style.display = "none";
        pageSliderForm.style.display = "flex";
        handleRangeInput();
        pagesToggleImage.classList.remove("fa-toggle-off");
        pagesToggleImage.classList.add("fa-toggle-on");
    }
}

function handleRangeInput(event) {
    if (!event) { 
        pageSliderValue = pageNumber;
        pageSlider.value = pageSliderValue;
    } else {
        pageSliderValue = event.target.value;
        pageNumber = pageSliderValue;
    }

    pageSliderOffsetWidth = pageSlider.offsetWidth;
    const correctionFactor = determineCorrectionFactor(pageSliderOffsetWidth);
    const newPoint = ((pageSliderValue - pageSliderMin)
        / (pageSliderMax - pageSliderMin))
        * correctionFactor;
    const offset = -10;
    const newPlace = (pageSliderOffsetWidth * newPoint) + offset;

    pageSliderOutput.style.left = newPlace + "px";
    pageSliderOutput.textContent = pageSliderValue;
}

function handleRangeChange() {
    displayShows(filteredShows);
}

function determineCorrectionFactor(pageSliderOffsetWidth) {
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

function filterShows(event) {
    pageNumber = 1;
    showPageSlider();
    
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
    showPageSlider();

    let selectedGenre = null;
    if (event) {
        selectedGenre = event.target.textContent; 
    }

    if (selectedGenre === "Remove filters!") {
        filteredShows = allShows;
        searchBar.value = "";
        
        selectedGenres.clear();
    } else {
        filteredShows = filterByGenres( filterByName(allShows, searchBar.value) );
    }

    displayShows(filteredShows);
}

function showPageSlider() {
    if (pages.style.display === "flex") {
        pages.style.display = "none";
        pageSliderForm.style.display = "flex";
    }
    handleRangeInput();
}

function handleGenrePill(event) {
    const { textContent, classList } = event.target;

    if (classList.contains("genre-pill") && classList.contains("highlighted")) {
        classList.remove("highlighted");
        selectedGenres.delete(textContent, classList);
        filterByGenre(event);
    } else if (classList.contains("genre-pill") && textContent !== "Remove filters!") {
        classList.add("highlighted");
        selectedGenres.add(textContent);
        filterByGenre(event);
    } else if (textContent === "Remove filters!") {
        filterByGenre(event);
    } else if (classList.contains("expander") || classList.contains("genre-pill-header")) {
        expandOrContract();
    } else if (!classList.contains("genre-pill")) {
        return;
    }
}

function expandOrContract() {
    const genrePillHeader = genrePillContainer.querySelector(".genre-pill-header");
    const expander = genrePillContainer.querySelector(".expander");

    if (genrePillContainer.style.maxHeight === "5rem") {
        genrePillContainer.style.maxHeight = "26rem";
        genrePillContainer.classList.remove("collapsed");

        genrePillHeader.classList.remove("bottom-sheet");

        expander.classList.remove("fa-bars");
        expander.classList.add("fa-times");
    } else if (genrePillContainer.style.maxHeight === "26rem") {
        genrePillContainer.style.maxHeight = "5rem";
        genrePillContainer.classList.add("collapsed");
        
        genrePillHeader.classList.add("bottom-sheet");

        expander.classList.remove("fa-times");
        expander.classList.add("fa-bars");
    }
}

function filterByName(shows, searchTerm) {
    return shows.filter(show => (
        show.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
    ));
}

function filterByGenres(shows) {
    const allGenres = Array.from(selectedGenres);
    return shows.filter(show => {
        return allGenres
            .every(selectedGenre => show.genres.includes(selectedGenre));
    });
}

function showSelectedGenres(currentSelectedGenre) {
    if (currentSelectedGenre !== "Remove filters!"
        && currentSelectedGenre !== null)
    { 
        selectedGenres.add(currentSelectedGenre);
    }
}

function removeShowCards() {
    const showCards = Array.from(document.querySelectorAll(".show-card"));
    showCards.forEach(showCard => showCard.remove());
}

function setGenreSelectors() {
    const previousPills = Array.from(genrePillContainer.querySelectorAll("li"));
    const previouslyAddedPills = previousPills.filter(selector => 
        !selector.textContent.includes("Filter by genre(s)!")
        && selector.textContent !== "Remove filters!"
    );

    previouslyAddedPills.forEach(pill => pill.remove());

    Array.from(genres).filter(genre => selectedGenres.has(genre)).sort().forEach(createGenreSelector);
    Array.from(genres).filter(genre => !selectedGenres.has(genre)).sort().forEach(createGenreSelector);
}

function createGenreSelector(genre) {
    const selector = document.createElement("li");
    selector.classList.add("genre-pill");
    selector.textContent = genre;
    
    genrePillContainer.append(selector);
    
    if (selectedGenres.has(genre)) {
        selector.classList.add("highlighted");
    }
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

    genres.clear();
    setGenres(shows);
    setGenreSelectors();

    const sortedShows = sorter[sortBy.value](shows);

    const allPages = createRange(Math.ceil(shows.length/50));
    setPageNumbers(allPages, shows);

    end = pageNumber * 50;
    start = end - 50;
    if (shows.length < end) { end = shows.length }
    
    checkForNoShows();
    
    const pageText = document.querySelector(".pages-container > h2");
    if (shows.length === 0) {
        createNoShowsText();
        pageText.style.display = "none";
        pageSliderForm.style.display = "none";
        pagesToggle.style.display = "none";
    } else if (shows.length < 51 ) {
        displayPage(sortedShows);
        pageText.style.display = "block";
        pages.style.display = "flex";
        pageSliderForm.style.display = "none";
        pagesToggle.style.display = "none";
    } else {
        displayPage(sortedShows);
        pageText.style.display = "block";
        pagesToggle.style.display = "inline-block";
        if (pages.style.display === "none") {
            pageSliderForm.style.display = "flex";
        }
    }
}

function displayPage(sortedShowsByRating) {
    for (let i = start; i < end; i++) {
        createShowCard(sortedShowsByRating[i]);
    }
}

function setPageNumbers(allPages, shows) {
    clearPreviousPageNumbers();
    createPageNumbers(allPages, shows);

    pageSlider.max = allPages.length;
    pageSliderMax = allPages.length;
    pageSliderRangeMax.textContent = allPages.length;
}

function createPageNumbers(allPages, shows) {
    const pageNumberAsNumber = parseInt(pageNumber, 10)

    let currentPages;
    if (pageNumberAsNumber < 6) {
        currentPages = allPages.slice(0, 9);
    } else if (pageNumberAsNumber > (allPages.length - 5)) {
        currentPages = allPages.slice(-9);
    } else {
        currentPages = allPages.slice( (pageNumberAsNumber - 5), ( pageNumberAsNumber + 4) );
    }

    currentPages.forEach(currentPageNumber => {
        const pageNumberLi = document.createElement("li");
        pageNumberLi.classList.add("page-number");
        pageNumberLi.textContent = currentPageNumber + 1;
        if ( (currentPageNumber + 1) === +pageNumber ) { 
            pageNumberLi.classList.add("selected");
        }

        pages.appendChild(pageNumberLi);

        pageNumberLi.addEventListener("click", (event) => showPageNumber(event, shows));
    });
}

function clearPreviousPageNumbers() {
    const previousPageNumbers = Array.from( document.querySelectorAll(".pages > li") );
    previousPageNumbers.forEach( previousPageNumber => previousPageNumber.remove() );
}

function showPageNumber(event, shows) {
    pageNumber = event.target.textContent;
    handleRangeInput();
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

function createShowCard(show) {
    const showCard = document.createElement("div");
    showCard.classList.add("show-card");

    const image = document.createElement("img");
    image.classList.add("show-image");
    image.src = show.image.medium;

    const showInfo = document.createElement("div");
    showInfo.classList.add("show-info");
    showInfo.style.display = "none";

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
    if (show.runtime) {
        runtime.textContent = "Runtime " + show.runtime + " mins";
    }

    const officialSite = document.createElement("a");
    if (show.officialSite) {
        officialSite.textContent = "Official Site";
        officialSite.href = show.officialSite;
        officialSite.target = "_blank";
        officialSite.rel = "noopener noreferrer";
    }

    showInfo.append(name, rating, year, runtime, officialSite);
    showCard.append(image, showInfo);
    showCardsContainer.append(showCard);

    showCard.addEventListener("click", () => displayShowInfo(showInfo));
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

function sortShowsByPremiered(shows) {
    return shows.sort((a, b) => {
        let premieredA;
        if (!a.premiered) { premieredA = 0; }
        else { premieredA = parseInt(a.premiered.slice(0, 4), 10); }
        
        let premieredB;
        if (!b.premiered) { premieredB = 0; }
        else { premieredB = parseInt(b.premiered.slice(0, 4), 10); }
        
        if (premieredA > premieredB) { return -1; }
        else if (premieredA < premieredB) { return 1; }
        else { return 0; }
    });
}

function sortShowsByName(shows) {
    return shows.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        else if (a.name > b.name) { return 1; }
        else { return 0; }
    });
}

function setGenres(shows) {
    shows.forEach(show => show.genres.forEach(genre => genres.add(genre)));
}

function displayShowInfo(showInfo) {
    showInfo.style.display === "none"
        ? showInfo.style.display = "flex"
        : showInfo.style.display = "none";
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
