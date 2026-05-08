import {
  getState,
  updateFilters,
  updateSort
} from "../../core/state.js";

let debounceTimer = null;

function option(
  value,
  label,
  current
) {
  return `
    <option
      value="${value}"
      ${
        current === value
          ? "selected"
          : ""
      }
    >
      ${label}
    </option>
  `;
}

export function createFilters() {
  const state = getState();

  const wrapper =
    document.createElement("section");

  wrapper.className = "toolbar-filters";

  wrapper.innerHTML = `
    <div class="toolbar-grid">
      <input
        class="search-input"
        id="advanced-search"
        type="search"
        placeholder="search title, author, isbn, publisher"
        value="${state.ui.searchQuery}"
      />

      <select
        class="select"
        id="filter-status"
      >
        ${option(
          "",
          "all statuses",
          state.ui.filters.status
        )}

        ${option(
          "wishlist",
          "wishlist",
          state.ui.filters.status
        )}

        ${option(
          "ordered",
          "ordered",
          state.ui.filters.status
        )}

        ${option(
          "owned",
          "owned",
          state.ui.filters.status
        )}
      </select>

      <select
        class="select"
        id="filter-priority"
      >
        ${option(
          "",
          "all priorities",
          state.ui.filters.priority
        )}

        ${option(
          "low",
          "low",
          state.ui.filters.priority
        )}

        ${option(
          "medium",
          "medium",
          state.ui.filters.priority
        )}

        ${option(
          "high",
          "high",
          state.ui.filters.priority
        )}
      </select>

      <select
        class="select"
        id="sort-by"
      >
        ${option(
          "createdAt",
          "date added",
          state.ui.sort.by
        )}

        ${option(
          "title",
          "title",
          state.ui.sort.by
        )}

        ${option(
          "author",
          "author",
          state.ui.sort.by
        )}

        ${option(
          "publishYear",
          "publish year",
          state.ui.sort.by
        )}

        ${option(
          "priority",
          "priority",
          state.ui.sort.by
        )}

        ${option(
          "status",
          "status",
          state.ui.sort.by
        )}
      </select>

      <button
        class="button button--secondary"
        id="sort-direction"
        type="button"
      >
        ${
          state.ui.sort.direction ===
          "asc"
            ? "ascending"
            : "descending"
        }
      </button>

      <button
        class="button button--secondary"
        id="reset-filters"
        type="button"
      >
        reset
      </button>
    </div>
  `;

  const search =
    wrapper.querySelector(
      "#advanced-search"
    );

  search.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      updateFilters({
        searchQuery: search.value
      });
    }, 220);
  });

  wrapper
    .querySelector("#filter-status")
    .addEventListener(
      "change",
      (event) => {
        updateFilters({
          status:
            event.target.value
        });
      }
    );

  wrapper
    .querySelector("#filter-priority")
    .addEventListener(
      "change",
      (event) => {
        updateFilters({
          priority:
            event.target.value
        });
      }
    );

  wrapper
    .querySelector("#sort-by")
    .addEventListener(
      "change",
      (event) => {
        updateSort({
          by: event.target.value
        });
      }
    );

  wrapper
    .querySelector("#sort-direction")
    .addEventListener(
      "click",
      () => {
        const current =
          getState().ui.sort
            .direction;

        updateSort({
          direction:
            current === "asc"
              ? "desc"
              : "asc"
        });
      }
    );

  wrapper
    .querySelector("#reset-filters")
    .addEventListener(
      "click",
      () => {
        updateFilters({
          searchQuery: "",
          status: "",
          priority: "",
          tags: "",
          publisher: ""
        });
      }
    );

  return wrapper;
}
