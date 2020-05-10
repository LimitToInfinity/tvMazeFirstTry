export function handleWindowScroll() {
    window.addEventListener("scroll", handleScroll);

    const showCardsContainer = document.querySelector(".show-cards-container");
    const pagesContainer = document.querySelector(".pages-container");
    
    function handleScroll() {
        if (window.matchMedia('(max-device-width: 600px)').matches) {
            if (window.scrollY < 1800) {
                showCardsContainer.prepend(pagesContainer);
            } else if (window.scrollY > 2200 && window.scrollY < 3000) {
                pagesContainer.remove();
            } else if (window.scrollY > 3400) {
                showCardsContainer.append(pagesContainer);
            }
        } else {
            if (window.scrollY < 700) {
                showCardsContainer.prepend(pagesContainer);
            } else if (window.scrollY > 850 && window.scrollY < 1450) {
                pagesContainer.remove();
            } else if (window.scrollY > 1600) {
                showCardsContainer.append(pagesContainer);
            }
        }
    }
}