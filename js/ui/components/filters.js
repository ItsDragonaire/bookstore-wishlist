import {
  getState,
  updateFilters,
  updateSort
} from "../../core/state.js";

let debounceTimer = null;

function option(
  value,
  label,
  selected
) {
  return `
    <option
      value="${value}"
      ${selected ? "selected" : ""}
    >
      ${label}
    </option>
  `;
}

export function createFilters() {
  const state = getState();

  const wrapper =
    document.createElement("section");

  wrapper.className = "filters-panel";

  wrapper.innerHTML = `
    <div class="filters-grid">
      <div class="form-field">
        <label class="form-label">
          status
        </label>

        <select
          class="select"
          id="filter-status"
        >
          ${option("", "all", true)}
          ${option(
            "wishlist",
            "wishlist"
          )}
          ${option(
            "ordered",
            "ordered"
          )}
          ${option("owned", "owned")}
        </select>
      </div>

      <div class="form-field">
        <label class="form-label">
          priority
        </label>

        <select
          class="select"
          id="filter-priority"
        >
          ${option("", "all", true)}
          ${option("low", "low")}
          ${option(
            "medium",
            "medium"
          )}
          ${option("high", "high")}
        </select>
      </div>

      <div class="form-field">
        <label class="form-label">
          publisher
        </label>

        <input
          class="input"
          id="filter-publisher"
          placeholder="publisher"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          tags
        </label>

        <input
          class="input"
          id="filter-tags"
          placeholder="comma separated"
        />
      </div>

      <div class="form-field">
        <label class="form-label">
          sort by
        </label>

        <select
          class="select"
          id="sort-by"
        >
          <option value="createdAt">
            date added
          </option>

          <option value="title">
            title
          </option>

          <option value="author">
            author
          </option>

          <option value="publishYear">
            publish year
          </option>

          <option value="priority">
            priority
          </option>

          <option value="status">
            status
          </option>
        </select>
      </div>

      <div class="form-field">
        <label class="form-label">
          direction
        </label>

        <select
          class="select"
          id="sort-direction"
        >
          <option value="asc">
            ascending
          </option>

          <option value="desc">
            descending
          </option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button
        class="button button--secondary"
        id="reset-filters"
        type="button"
      >
        reset filters
      </button>
    </div>
  `;

  const currentFilters =
    state.ui.filters;

  const currentSort =
    state.ui.sort;

  wrapper.querySelector(
    "#filter-status"
  ).value =
    currentFilters.status || "";

  wrapper.querySelector(
    "#filter-priority"
  ).value =
    currentFilters.priority || "";

  wrapper.querySelector(
    "#filter-publisher"
  ).value =
    currentFilters.publisher || "";

  wrapper.querySelector(
    "#filter-tags"
  ).value =
    currentFilters.tags || "";

  wrapper.querySelector(
    "#sort-by"
  ).value =
    currentSort.by;

  wrapper.querySelector(
    "#sort-direction"
  ).value =
    currentSort.direction;

  function syncFilters() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      updateFilters({
        status:
          wrapper.querySelector(
            "#filter-status"
          ).value,

        priority:
          wrapper.querySelector(
            "#filter-priority"
          ).value,

        publisher:
          wrapper.querySelector(
            "#filter-publisher"
          ).value,

        tags:
          wrapper.querySelector(
            "#filter-tags"
          ).value
      });
    }, 260);
  }

  wrapper
    .querySelectorAll(
      "input, select"
    )
    .forEach((element) => {
      element.addEventListener(
        "input",
        syncFilters
      );
    });

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
    .querySelector(
      "#sort-direction"
    )
    .addEventListener(
      "change",
      (event) => {
        updateSort({
          direction:
            event.target.value
        });
      }
    );

  wrapper
    .querySelector(
      "#reset-filters"
    )
    .addEventListener(
      "click",
      () => {
        updateFilters({
          status: "",
          priority: "",
          publisher: "",
          tags: ""
        });
      }
    );

  return wrapper;
}
