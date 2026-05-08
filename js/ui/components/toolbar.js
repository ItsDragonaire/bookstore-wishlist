import {
  getState,
  setPrintMode,
  setView
} from "../../core/state.js";

import { createFilters } from "./filters.js";

import { exportBooksCsv } from "../../utils/csv.js";

let filtersMounted = false;

export function initializeToolbar() {
  const toolbar =
    document.querySelector(
      ".toolbar"
    );

  if (!filtersMounted) {
    toolbar.append(
      createFilters()
    );

    filtersMounted = true;
  }

  const printButton =
    document.createElement(
      "button"
    );

  printButton.className =
    "button button--secondary";

  printButton.type = "button";

  printButton.textContent =
    "print";

  printButton.addEventListener(
  "click",
  () => {
    setPrintMode(true);

    requestAnimationFrame(() => {
      window.print();
    });
  }
);

  toolbar
    .querySelector(
      ".toolbar__actions"
    )
    ?.append(printButton);

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
