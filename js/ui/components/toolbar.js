import {
  getState,
  setPrintMode,
  setView
} from "../../core/state.js";

import { createFilters } from "./filters.js";

import { exportBooksCsv } from "../../utils/csv.js";

import {
  exportJsonBackup,
  importJsonBackup
} from "../../utils/json.js";

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

  const exportCsvButton =
  document.createElement(
    "button"
  );

exportCsvButton.className =
  "button button--secondary";

exportCsvButton.type =
  "button";

exportCsvButton.textContent =
  "export csv";

exportCsvButton.addEventListener(
  "click",
  () => {
    const state =
      getState();

    exportBooksCsv({
      books: state.books
    });
  }
);

const exportJsonButton =
  document.createElement(
    "button"
  );

exportJsonButton.className =
  "button button--secondary";

exportJsonButton.type =
  "button";

exportJsonButton.textContent =
  "backup json";

exportJsonButton.addEventListener(
  "click",
  () => {
    exportJsonBackup(
      getState()
    );
  }
);

const importInput =
  document.createElement(
    "input"
  );

importInput.type = "file";

importInput.accept =
  "application/json";

importInput.hidden = true;

importInput.addEventListener(
  "change",
  async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const imported =
        await importJsonBackup(
          file
        );

      const {
        replaceState
      } = await import(
        "../../core/state.js"
      );

      replaceState(
        imported
      );

      alert(
        "backup restored successfully"
      );
    } catch (error) {
      alert(
        error.message ||
          "failed to restore backup"
      );
    }

    importInput.value = "";
  }
);

const importJsonButton =
  document.createElement(
    "button"
  );

importJsonButton.className =
  "button button--secondary";

importJsonButton.type =
  "button";

importJsonButton.textContent =
  "import json";

importJsonButton.addEventListener(
  "click",
  () => {
    importInput.click();
  }
);

const printButton =
  document.createElement(
    "button"
  );

printButton.className =
  "button button--secondary";

printButton.type =
  "button";

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
  ?.append(
    exportCsvButton,
    exportJsonButton,
    importJsonButton,
    printButton,
    importInput
  );

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
