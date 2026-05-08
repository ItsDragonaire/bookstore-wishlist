import {
  createDefaultState,
  validateStateShape
} from "./schema.js";

const STORAGE_KEY =
  "bookstore-wishlist";

let pendingState = null;

let writeScheduled = false;

function commitSave() {
  if (!pendingState) {
    writeScheduled = false;

    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        pendingState
      )
    );
  } catch (error) {
    console.error(
      "storage save failed",
      error
    );
  }

  pendingState = null;

  writeScheduled = false;
}

export function saveState(
  state
) {
  pendingState = state;

  if (writeScheduled) {
    return;
  }

  writeScheduled = true;

  const schedule =
    window.requestIdleCallback ||
    ((callback) =>
      setTimeout(
        callback,
        120
      ));

  schedule(commitSave);
}

export function clearStorage() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

export function loadState() {
  const defaults =
    createDefaultState();

  let parsed;

  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return defaults;
    }

    parsed = JSON.parse(raw);
  } catch (error) {
    console.error(
      "storage parse failed",
      error
    );

    clearStorage();

    return defaults;
  }

  const valid =
    validateStateShape(
      parsed
    );

  if (!valid) {
    console.warn(
      "invalid storage schema"
    );

    clearStorage();

    return defaults;
  }

  return {
    ...defaults,
    ...parsed,

    books: Array.isArray(
      parsed.books
    )
      ? parsed.books
      : [],

    ui: {
      ...defaults.ui,
      ...(parsed.ui || {})
    }
  };
}
