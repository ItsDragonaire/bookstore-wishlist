import {
  getState,
  setView,
  updateSearch
} from "../../core/state.js";

export function initializeToolbar() {
  const searchInput =
    document.querySelector("#search-input");

  const viewButtons =
    document.querySelectorAll(
      ".view-switcher__button"
    );

  searchInput.addEventListener("input", (event) => {
    updateSearch(event.target.value);
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
    });
  });
}

export function syncToolbar() {
  const state = getState();

  document.querySelector("#search-input").value =
    state.ui.searchQuery;

  document
    .querySelectorAll(".view-switcher__button")
    .forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.view ===
          state.ui.currentView
      );
    });
}
