document.addEventListener("DOMContentLoaded", postLoad);

let searchBar;
let searchBarLabel;
let genreSelector;
let allShows;
let filteredShows;
const genres = new Set();
const selectedGenres = new Set();

function postLoad()
{
    searchBar = document.querySelector("#search-bar");
    searchBarLabel = document.querySelector("label[for=search-bar]");
    genreSelector = document.querySelector(".genre-selector")

    fetch("https://api.tvmaze.com/shows")
    .then(parseJSON)
    .then(setAllShows)
    .then(displayShows);

    searchBar.addEventListener("input", filterMovies);
    searchBar.addEventListener("focus", addShrinkClass);
    searchBar.addEventListener("blur", removeShrinkClass);
    genreSelector.addEventListener("change", filterByGenre);
}

function filterByGenre(event)
{
    const selectedGenre = event.target.value; 

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
        filteredShows = filteredShows.filter(show => {
            return show.genres.some(genre => selectedGenre === genre);
        });
    }

    displayShows(filteredShows);
}

function showSelectedGenres(currentSelectedGenre)
{

    if (currentSelectedGenre != "show-all" && currentSelectedGenre != "")
    { 
        selectedGenres.add(currentSelectedGenre);
    }

    clearDisplayedSelectedGenres();

    selectedGenres.forEach(selectedGenre => {
        const selectedGenreLi = document.createElement("li");
        selectedGenreLi.classList.add("selected-genre");
        selectedGenreLi.textContent = selectedGenre;
        
        const selectedGenresUl = document.querySelector(".selected-genres");
        selectedGenresUl.append(selectedGenreLi);
    });
}

function filterMovies(event)
{
    const searchTerm = event.target.value;
    removeCards();

    filteredShows = filteredShows.filter(show => 
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
    selector.innerText = genre;

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
    allShows = shows;
    filteredShows = shows;

    return shows;
}

function displayShows(shows)
{
    const cardsContainer = document.querySelector(".cards-container");

    clearDisplayedSelectedGenresCheck();

    genres.clear();
    shows.forEach(show => createShowCard(show, cardsContainer));
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
    image.classList.add("show-image")
    image.src = show.image.medium;

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("movie-info");

    const name = document.createElement("h4");
    name.classList.add("movie-title");
    name.innerText = show.name;

    const year = document.createElement("p");
    year.innerText = "Premiered " + show.premiered.slice(0, 4);

    const runtime = document.createElement("p");
    runtime.innerText = "Runtime " + show.runtime + " mins";

    // const officialSite = document.createElement("p");
    const officialSite = document.createElement("a")
    officialSite.textContent = "Official Site";
    officialSite.href = show.officialSite;

    // officialSite.append(link);
    movieInfo.append(name, year, runtime, officialSite);
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

function parseJSON(response)
{
    return response.json();
}