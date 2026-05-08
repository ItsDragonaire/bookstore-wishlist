import {
  getState,
  setView
} from "../../core/state.js";

import { createFilters } from "./filters.js";

let filtersMounted = false;

export function initializeToolbar() {
  const toolbar =
    document.querySelector(".toolbar");

  if (!filtersMounted) {
    toolbar.append(
      createFilters()
    );

    filtersMounted = true;
  }

  const viewButtons =
    document.querySelectorAll(
      ".view-switcher__button"
    );

  viewButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        setView(
          button.dataset.view
        );
      }
    );
  });
}

export function syncToolbar() {
  const state = getState();

  document
    .querySelectorAll(
      ".view-switcher__button"
    )
    .forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.view ===
          state.ui.currentView
      );
    });
}
