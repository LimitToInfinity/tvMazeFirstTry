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

export function fetchShowsPage(showsPage) {
    const url = `https://api.tvmaze.com/shows?page=${showsPage}`;
    return fetch(url);
}

export function createRangeFromTo(start, end) {
    const length = (end - start) + 1;
    return Array.from( { length }, (_, index) => start + index );
}

export function flattenResponses(arrays) {
    return arrays.flat();
}

export function parseResponsesToJSON(responses) {
    return Promise.all(responses.map(parseJSON));
}

function parseJSON(response) {
    return response.json();
}