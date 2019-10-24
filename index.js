document.addEventListener("DOMContentLoaded", postLoad);

const fetchCalls = [];
let searchBar;
let searchBarLabel;
let genreSelector;
let allShows = [];
let filteredShows = [];
const genres = new Set();
const selectedGenres = new Set();

function postLoad()
{
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search-bar]");
    genreSelector = document.querySelector(".genre-selector");

    const showsPages = createRange(5);
    showsPages.map(makeFetchCalls);

    Promise.all(fetchCalls)
        .then(parseAllToJSON)
        .then(flattenResponses)
        .then(setAllShows)
        .then(displayShows);
    

    searchBar.addEventListener("input", filterMovies);
    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    genreSelector.addEventListener("change", filterByGenre);
}

function filterByGenre(event)
{
    let selectedGenre = null;
    if (event)
    {
        selectedGenre = event.target.value; 
    }

    showSelectedGenres(selectedGenre);
    
    removeCards();

    if (selectedGenre === "show-all" || selectedGenre === "")
    { 
        filteredShows = allShows;
        searchBar.value = "";
        genreSelector.value = "";

        selectedGenres.clear();
    }
    else
    {
        filteredShows = allShows.filter(show => {
            return Array.from(selectedGenres).every(selectedGenre => show.genres.includes(selectedGenre));
        });
    }

    displayShows(filteredShows);
}

function showSelectedGenres(currentSelectedGenre)
{

    if (currentSelectedGenre != "show-all"
        && currentSelectedGenre != ""
        && currentSelectedGenre != null)
    { 
        selectedGenres.add(currentSelectedGenre);
    }

    clearDisplayedSelectedGenres();

    selectedGenres.forEach(selectedGenre => {
        const selectedGenreLi = document.createElement("li");
        selectedGenreLi.classList.add("selected-genre");
        selectedGenreLi.textContent = selectedGenre;

        const deleteImage = document.createElement("i");
        deleteImage.className = ("fa fa-times");
        
        selectedGenreLi.append(deleteImage);

        selectedGenreLi.addEventListener("click", () => removeGenre(selectedGenre));

        const selectedGenresUl = document.querySelector(".selected-genres");
        selectedGenresUl.append(selectedGenreLi);
    });
}

function removeGenre(selectedGenre)
{
    selectedGenres.delete(selectedGenre);
    filterByGenre(null);
}

function filterMovies(event)
{
    const searchTerm = event.target.value;
    removeCards();

    filteredShows = allShows.filter(show => 
        show.name.toLowerCase()
        .includes(
            searchTerm.toLowerCase()
        )
    );
    
    if (filteredShows.length === 0) { genres.clear(); }
    if (searchTerm.length === 0)
    {
        filteredShows = allShows;
        selectedGenres.clear();
    }
    
    displayShows(filteredShows);
}

function removeCards()
{
    const cards = Array.from(document.querySelectorAll(".card"));
    cards.forEach(card => card.remove());
}

function setGenreSelectors()
{
    const previousSelectors = Array.from(genreSelector.querySelectorAll("option"));
    const previouslyAddedSelectors = previousSelectors.filter(selector => 
        selector.value.length > 0
        && 
        selector.value != "show-all"
    );
    previouslyAddedSelectors.forEach(selector => selector.remove());

    genres.forEach(createGenreSelectors);
}

function createGenreSelectors(genre)
{
    const selector = document.createElement("option");
    selector.classList.add("genre-option");
    selector.value = genre;
    selector.textContent = genre;

    genreSelector.append(selector);
}

function addShrinkClass()
{
    // console.log("shrink")
    searchBarLabel.classList.remove("shrink-uncolored");
    searchBarLabel.classList.add("shrink-colored");
}

function removeShrinkClass()
{
    if (!searchBar.value)
    {
        // console.log("unshrink no value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.remove("shrink-uncolored");
    }
    else
    {
        // console.log("unshrink value")
        searchBarLabel.classList.remove("shrink-colored");
        searchBarLabel.classList.add("shrink-uncolored");
    }
}

function setAllShows(shows)
{
    allShows = shows.filter(show => show.image);
    filteredShows = allShows;

    return allShows;
}

function displayShows(shows)
{
    const cardsContainer = document.querySelector(".cards-container");

    clearDisplayedSelectedGenresCheck();

    genres.clear();

    const sortedShows = shows.sort((a, b) => {
        let ratingA = a.rating.average;
        if (!ratingA){ ratingA = 0; }
        let ratingB = b.rating.average;
        if (!ratingB){ ratingB = 0; }
        
        if (ratingA > ratingB){ return -1; }
        else if (ratingA < ratingB){ return 1; }
        else { return 0; }
    })

    let length;
    if (shows.length < 150){ length = shows.length; }
    else { length = 150; }
    for (let i = 0; i < length; i++)
    {
        createShowCard(sortedShows[i], cardsContainer);
    }
}

function clearDisplayedSelectedGenresCheck()
{
    if (filteredShows === allShows)
    {
        clearDisplayedSelectedGenres();
    }
}

function clearDisplayedSelectedGenres()
{
    const selectedGenreLis = Array.from(document.querySelectorAll(".selected-genres > li"));
    selectedGenreLis.forEach(selectedGenreLi => selectedGenreLi.remove());
}

function createShowCard(show, cardsContainer)
{
    show.genres.forEach(genre => genres.add(genre));
    setGenreSelectors();

    const card = document.createElement("div");
    card.classList.add("card");

    const image = document.createElement("img");
    image.classList.add("show-image");
    image.src = show.image.medium;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");

    const name = document.createElement("h4");
    name.classList.add("movie-title");
    name.textContent = show.name;
    
    const rating = document.createElement("p");
    if (show.rating.average)
    {
        rating.textContent = "Rating " + show.rating.average.toFixed(1);
    }
    else
    {
        rating.textContent = "No Rating";
    }

    const year = document.createElement("p");
    if (show.premiered)
    {
        year.textContent = "Premiered " + show.premiered.slice(0, 4);
    }

    const runtime = document.createElement("p");
    runtime.textContent = "Runtime " + show.runtime + " mins";

    const officialSite = document.createElement("a");
    officialSite.textContent = "Official Site";
    officialSite.href = show.officialSite;

    movieInfo.append(name, rating, year, runtime, officialSite);
    card.append(image);
    cardsContainer.append(card);

    card.addEventListener("click", () => showInfo(card, movieInfo));
}

function showInfo(card, movieInfo)
{   
    if (!card.querySelector(".movie-info"))
    {
        card.append(movieInfo);
    }
    else
    {
        movieInfo.remove();
    }
}

function makeFetchCalls(showsPage)
{
    return fetchCalls.push(fetch(`https://api.tvmaze.com/shows?page=${showsPage}`));
}

function createRange(number)
{
    return [...Array(number).keys()];
}

function flattenResponses(arrays)
{
    return arrays.reduce((flattenedArray, array) =>
    {
        return flattenedArray.concat(array);
    },
    []
    );
}

function parseAllToJSON(responses)
{
    return Promise.all(responses.map(parseJSON));
}

function parseJSON(response)
{
    return response.json();
}