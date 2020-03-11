export const sorter = {
    "Most popular"(shows){ return sortShowsByMostPopular(
        sortShowsByHighestRating( sortShowsByMostRecent(shows))); },
    "Least popular"(shows){ return sortShowsByLeastPopular(
        sortShowsByLowestRating( sortShowsByLeastRecent(shows))); },
    "Highest rating"(shows){ return sortShowsByHighestRating(
        sortShowsByMostPopular( sortShowsByMostRecent(shows))); },
    "Lowest rating"(shows){ return sortShowsByLowestRating(
        sortShowsByLeastPopular( sortShowsByLeastRecent(shows))); },
    "Most recent"(shows){ return sortShowsByMostRecent(
        sortShowsByMostPopular( sortShowsByHighestRating(shows))); },
    "Least recent"(shows){ return sortShowsByLeastRecent(
        sortShowsByLeastPopular( sortShowsByHighestRating(shows))); },
    "A to Z"(shows){ return sortShowsAToZ(
        sortShowsByMostPopular( sortShowsByHighestRating( sortShowsByMostRecent(shows)))); },
    "Z to A"(shows){ return sortShowsZToA(
        sortShowsByMostPopular( sortShowsByHighestRating( sortShowsByMostRecent(shows)))); },
}

function sortShowsByMostPopular(shows) {
    return shows.sort((a, b) => {
        let aPopular;
        a.rating
            ? aPopular = a.weight + a.rating.average
            : aPopular = a.weight;

        let bPopular;
        b.rating
            ? bPopular = b.weight + b.rating.average
            : bPopular = b.weight;
        
        if (aPopular > bPopular) { return -1; }
        else if (aPopular < bPopular) { return 1; }
        else { return 0; }
    });
}

function sortShowsByLeastPopular(shows) {
    return shows.sort((a, b) => {
        let aPopular;
        a.rating
            ? aPopular = a.weight + a.rating.average
            : aPopular = a.weight;

        let bPopular;
        b.rating
            ? bPopular = b.weight + b.rating.average
            : bPopular = b.weight;
        
        if (bPopular > aPopular) { return -1; }
        else if (bPopular < aPopular) { return 1; }
        else { return 0; }
    });
}

function sortShowsByHighestRating(shows) {
    return shows.sort((a, b) => {
        let ratingA
        a.rating
            ? ratingA = a.rating.average
            : ratingA = 0

        let ratingB
        b.rating
            ? ratingB = b.rating.average
            : ratingB = 0
        
        if (ratingA > ratingB) { return -1; }
        else if (ratingA < ratingB) { return 1; }
        else { return 0; }
    });
}

function sortShowsByLowestRating(shows) {
    return shows.sort((a, b) => {
        let ratingA
        a.rating
            ? ratingA = a.rating.average
            : ratingA = 0

        let ratingB
        b.rating
            ? ratingB = b.rating.average
            : ratingB = 0
        
        if (ratingB > ratingA) { return -1; }
        else if (ratingB < ratingA) { return 1; }
        else { return 0; }
    });
}

function sortShowsByMostRecent(shows) {
    return shows.sort((a, b) => {
        let premieredA;
        a.premiered
            ? premieredA = new Date(a.premiered)
            : premieredA = 0;
        
        let premieredB;
        b.premiered
            ? premieredB = new Date(b.premiered)
            : premieredB = 0;
            
        if (premieredA > premieredB) { return -1; }
        else if (premieredA < premieredB) { return 1; }
        else { return 0; }
    });
}

function sortShowsByLeastRecent(shows) {
    return shows.sort((a, b) => {
        let premieredA;
        a.premiered
            ? premieredA = new Date(a.premiered)
            : premieredA = 0;
        
        let premieredB;
        b.premiered
            ? premieredB = new Date(b.premiered)
            : premieredB = 0;
        
        if (premieredB > premieredA) { return -1; }
        else if (premieredB < premieredA) { return 1; }
        else { return 0; }
    });
}

function sortShowsAToZ(shows) {
    return shows.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        else if (a.name > b.name) { return 1; }
        else { return 0; }
    });
}

function sortShowsZToA(shows) {
    return shows.sort((a, b) => {
        if (b.name < a.name) { return -1; }
        else if (b.name > a.name) { return 1; }
        else { return 0; }
    });
}