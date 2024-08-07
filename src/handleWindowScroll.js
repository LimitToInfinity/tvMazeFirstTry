import { APP_STATE } from "./index.js";

export function handleWindowListeners() {
  window.addEventListener("resize", APP_STATE.pages.handleRangeInput);
  window.addEventListener("click", handleCollapseSearch);
  window.addEventListener("scroll", handleScroll);

  const searchContainer = document.querySelector(".genre-pills");
  const showCardsContainer = document.querySelector(".show-cards-container");
  const pagesContainer = document.querySelector(".pages-container");

  function handleCollapseSearch(event) {
    const isSearchContainerExpanded = searchContainer.classList.contains('expanded');
    const isClickOutsideSearchContainer = !event.target.closest('.genre-pills');
    const isClickNotGenre = !event.target.closest('.genre-pill');
    const isClickNotHamburger = !event.target.closest('.hamburger');

    if (isSearchContainerExpanded
      && isClickOutsideSearchContainer
      && isClickNotGenre
      && isClickNotHamburger
    ) {
      searchContainer.classList.remove('expanded');
      searchContainer.classList.add('collapsed');

      const hamburgersOpen = Array.from(
        document.querySelectorAll('.hamburger > .expander.fold')
      );
      hamburgersOpen.forEach(searchOpener => searchOpener.classList.remove('fold'));
    }
  }

  function handleScroll() {
    const isMobile =
      window.matchMedia('(max-device-width: 600px)').matches;

    isMobile
      ? handleMobilePagesDisplay(window.scrollY)
      : handleDesktopPagesDisplay(window.scrollY);
  }

  function handleMobilePagesDisplay(pageYPosition) {
    if (pageYPosition < 1800) {
      showCardsContainer.prepend(pagesContainer);
    } else if (pageYPosition > 2200 && pageYPosition < 3000) {
      pagesContainer.remove();
    } else if (pageYPosition > 3400) {
      showCardsContainer.append(pagesContainer);
    }
  }

  function handleDesktopPagesDisplay(pageYPosition) {
    if (pageYPosition < 700) {
      showCardsContainer.prepend(pagesContainer);
    } else if (pageYPosition > 850 && pageYPosition < 1450) {
      pagesContainer.remove();
    } else if (pageYPosition > 1600) {
      showCardsContainer.append(pagesContainer);
    }
  }
}