export function createElement(elementName) {
    return document.createElement(elementName);
}

export function createElementWithAttributes(element, attributes) {
    return Object.assign(createElement(element), attributes);
}

export function appendElementsTo(parentElement, ...elements) {
    parentElement.append(...elements);
    return parentElement;
}

export function addClassesTo(element, ...classNames) {
    element.classList.add(...classNames);
    return element;
}

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