import {
  getState,
  setPrintMode,
  setView
} from "../../core/state.js";

import { exportBooksCsv } from "../../utils/csv.js";

import {
  exportJsonBackup,
  importJsonBackup
} from "../../utils/json.js";

import { createFilters } from "./filters.js";

import {
  closeModal,
  openModal
} from "./modal.js";

import { notify } from "./notifications.js";

let filtersMounted = false;

function createExportPanel() {
  const wrapper =
    document.createElement(
      "section"
    );

  wrapper.className =
    "form-grid";

  wrapper.innerHTML = `
    <button
      class="button button--secondary"
      type="button"
      id="export-csv"
    >
      export csv
    </button>

    <button
      class="button button--secondary"
      type="button"
      id="export-json"
    >
      backup json
    </button>

    <button
      class="button button--secondary"
      type="button"
      id="import-json"
    >
      restore backup
    </button>

    <button
      class="button button--primary"
      type="button"
      id="print-collection"
    >
      print order sheet
    </button>
  `;

  const importInput =
    document.createElement(
      "input"
    );

  importInput.type = "file";

  importInput.accept =
    "application/json";

  importInput.hidden = true;

  wrapper.append(importInput);

  wrapper
    .querySelector(
      "#export-csv"
    )
    .addEventListener(
      "click",
      () => {
        exportBooksCsv({
          books:
            getState().books
        });

        notify({
          title:
            "csv exported",

          text:
            "bookstore order sheet downloaded",

          type:
            "success"
        });
      }
    );

  wrapper
    .querySelector(
      "#export-json"
    )
    .addEventListener(
      "click",
      () => {
        exportJsonBackup(
          getState()
        );

        notify({
          title:
            "backup created",

          text:
            "json backup downloaded",

          type:
            "success"
        });
      }
    );

  wrapper
    .querySelector(
      "#import-json"
    )
    .addEventListener(
      "click",
      () => {
        importInput.click();
      }
    );

  importInput.addEventListener(
    "change",
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const restored =
          await importJsonBackup(
            file
          );

        const {
          replaceState
        } = await import(
          "../../core/state.js"
        );

        replaceState(
          restored
        );

        notify({
          title:
            "backup restored",

          text:
            `${restored.books.length} books imported`,

          type:
            "success"
        });

        closeModal();
      } catch (error) {
        notify({
          title:
            "restore failed",

          text:
            error.message ||
            "invalid backup file",

          type:
            "error",
          duration: 5000
        });
      }

      importInput.value = "";
    });

  wrapper
    .querySelector(
      "#print-collection"
    )
    .addEventListener(
      "click",
      () => {
        setPrintMode(true);

        closeModal();

        requestAnimationFrame(
          () => {
            window.print();
          }
        );
      }
    );

  return wrapper;
}

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

  const exportButton =
    document.createElement(
      "button"
    );

  exportButton.className =
    "button button--secondary";

  exportButton.type =
    "button";

  exportButton.textContent =
    "export";

  exportButton.addEventListener(
    "click",
    () => {
      openModal({
        title:
          "export & backup",

        description:
          "manage bookstore exports and collection backups",

        content:
          createExportPanel(),

        size: "compact"
      });
    }
  );

  toolbar
    .querySelector(
      ".toolbar__actions"
    )
    ?.append(exportButton);

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
