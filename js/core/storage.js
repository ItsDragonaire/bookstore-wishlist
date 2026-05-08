import {
  DEFAULT_STATE,
  STORAGE_KEY,
  validateState
} from "./schema.js";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return structuredClone(DEFAULT_STATE);
    }

    const parsed = JSON.parse(raw);

    return validateState(parsed);
  } catch (error) {
    console.error("failed to load state", error);

    localStorage.removeItem(STORAGE_KEY);

    return structuredClone(DEFAULT_STATE);
  }
}

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
      JSON.stringify(pendingState)
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

export function saveState(state) {
  pendingState = state;

  if (writeScheduled) {
    return;
  }

  writeScheduled = true;

  const schedule =
    window.requestIdleCallback ||
    ((callback) =>
      window.setTimeout(callback, 120));

  schedule(commitSave);
}
