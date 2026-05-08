import {
  reorderBooks
} from "../../core/state.js";

let sortableInstance = null;

async function loadSortable() {
  if (window.Sortable) {
    return window.Sortable;
  }

  const module = await import(
    "https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/+esm"
  );

  return module.default;
}

export async function initializeDragDrop({
  containerSelector
}) {
  const container =
    document.querySelector(
      containerSelector
    );

  if (!container) {
    return;
  }

  if (sortableInstance) {
    sortableInstance.destroy();
  }

  const Sortable =
    await loadSortable();

  sortableInstance =
    new Sortable(container, {
      animation: 140,

      handle:
        ".book-card, .book-meta-title",

      ghostClass:
        "drag-ghost",

      chosenClass:
        "drag-chosen",

      dragClass:
        "drag-active",

      forceFallback: false,

      fallbackTolerance: 4,

      onEnd(event) {
        const {
          oldIndex,
          newIndex
        } = event;

        if (
          oldIndex === undefined ||
          newIndex === undefined ||
          oldIndex === newIndex
        ) {
          return;
        }

        reorderBooks(
          oldIndex,
          newIndex
        );
      }
    });
}

export function destroyDragDrop() {
  if (!sortableInstance) {
    return;
  }

  sortableInstance.destroy();

  sortableInstance = null;
}
