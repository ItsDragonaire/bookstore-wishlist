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

export function saveState(state) {
  try {
    const validated = validateState(state);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(validated)
    );

    return true;
  } catch (error) {
    console.error("failed to save state", error);

    return false;
  }
}
