export const sorter = {
    "Most popular": (shows) => { return sortShowsByMostPopular(
        sortShowsByHighestRating( sortShowsByMostRecent(shows) ) );
    },
    "Least popular": (shows) => { return sortShowsByLeastPopular(
        sortShowsByLowestRating( sortShowsByLeastRecent(shows) ) );
    },
    "Highest rating": (shows) => { return sortShowsByHighestRating(
        sortShowsByMostPopular( sortShowsByMostRecent(shows) ) );
    },
    "Lowest rating": (shows) => { return sortShowsByLowestRating(
        sortShowsByLeastPopular( sortShowsByLeastRecent(shows) ) );
    },
    "Most recent": (shows) => { return sortShowsByMostRecent(
        sortShowsByMostPopular( sortShowsByHighestRating(shows) ) );
    },
    "Least recent": (shows) => { return sortShowsByLeastRecent(
        sortShowsByLeastPopular( sortShowsByHighestRating(shows) ) );
    },
    "A to Z": (shows) => { return sortShowsAToZ(
        sortShowsByMostPopular( sortShowsByHighestRating( 
        sortShowsByMostRecent(shows) ) ) );
    },
    "Z to A": (shows) => { return sortShowsZToA(
        sortShowsByMostPopular( sortShowsByHighestRating( 
        sortShowsByMostRecent(shows) ) ) );
    },
}

function sortShowsByMostPopular(shows) {
    return shows.sort((a, b) => byWeightPlusRating(a, b, true));
}

function sortShowsByLeastPopular(shows) {
    return shows.sort((a, b) => byWeightPlusRating(a, b, false));
}

function sortShowsByHighestRating(shows) {
    return shows.sort((a, b) => byRating(a, b, true));
}

function sortShowsByLowestRating(shows) {
    return shows.sort((a, b) => byRating(a, b, false));
}

function sortShowsByMostRecent(shows) {
    return shows.sort((a, b) => byRecent(a, b, true));
}

function sortShowsByLeastRecent(shows) {
    return shows.sort((a, b) => byRecent(a, b, false));
}

function sortShowsAToZ(shows) {
    return shows.sort(byAToZ);
}

function sortShowsZToA(shows) {
    return shows.sort(byZToA);
}

function byWeightPlusRating(a, b, isByMost) {
    const aPopular = a.rating
        ? a.weight + a.rating.average
        : a.weight;
    
    const bPopular = b.rating
        ? b.weight + b.rating.average
        : b.weight;
    
    return isByMost ? byMostPopular(aPopular, bPopular)
        : byLeastPopular(aPopular, bPopular);
}

function byMostPopular(aPopular, bPopular) {
    if (aPopular > bPopular) { return -1; }
    else if (aPopular < bPopular) { return 1; }
    else { return 0; }
}

function byLeastPopular(aPopular, bPopular) {
    if (bPopular > aPopular) { return -1; }
    else if (bPopular < aPopular) { return 1; }
    else { return 0; }
}

function byRating(a, b, isByHighest) {
    const ratingA = a.rating
        ? a.rating.average
        : 0;

    const ratingB = b.rating
        ? b.rating.average
        : 0;
    
    return isByHighest ? byHighestRating(ratingA, ratingB)
        : byLowestRating(ratingA, ratingB);
}

function byHighestRating(ratingA, ratingB) {
    if (ratingA > ratingB) { return -1; }
    else if (ratingA < ratingB) { return 1; }
    else { return 0; }
}

function byLowestRating(ratingA, ratingB) {
    if (ratingB > ratingA) { return -1; }
    else if (ratingB < ratingA) { return 1; }
    else { return 0; }
}

function byRecent(a, b, isByMost) {
    const premieredA = a.premiered
        ? new Date(a.premiered)
        : 0;
    
    const premieredB = b.premiered
        ? new Date(b.premiered)
        : 0;
        
    return isByMost ? byMostRecent(premieredA, premieredB)
        : byLeastRecent(premieredA, premieredB);
}

function byMostRecent(premieredA, premieredB) {
    if (premieredA > premieredB) { return -1; }
    else if (premieredA < premieredB) { return 1; }
    else { return 0; }
}

function byLeastRecent(premieredA, premieredB) {
    if (premieredB > premieredA) { return -1; }
    else if (premieredB < premieredA) { return 1; }
    else { return 0; }
}

function byAToZ(a, b) {
    if (a.name < b.name) { return -1; }
    else if (a.name > b.name) { return 1; }
    else { return 0; }
}

function byZToA(a, b) {
    if (b.name < a.name) { return -1; }
    else if (b.name > a.name) { return 1; }
    else { return 0; }
}