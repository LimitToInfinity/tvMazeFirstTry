export function makeFetchCalls(showsPage) {
    const url = `https://api.tvmaze.com/shows?page=${showsPage}`;
    return fetch(url);
}

export function createRange(number) {
    return [...Array(number).keys()];
}

export function flattenResponses(arrays) {
    return arrays.flat();
}

export function parseAllToJSON(responses) {
    return Promise.all(responses.map(parseJSON));
}

function parseJSON(response) {
    return response.json();
}