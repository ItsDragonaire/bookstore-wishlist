import {
  deleteBook,
  updateBook
} from "../../core/state.js";

import { notify } from "../components/notifications.js";

const SWIPE_THRESHOLD = 88;

const MAX_VERTICAL_DRIFT = 42;

function getPoint(event) {
  if (event.touches?.length) {
    return event.touches[0];
  }

  if (event.changedTouches?.length) {
    return event.changedTouches[0];
  }

  return event;
}

function applyTransform(
  element,
  deltaX
) {
  element.style.transform =
    `translateX(${deltaX}px)`;

  element.style.transition =
    "none";
}

function resetTransform(
  element
) {
  element.style.transition =
    "transform 180ms ease";

  element.style.transform =
    "translateX(0)";
}

function commitAction({
  element,
  direction,
  book
}) {
  element.style.transition =
    "transform 180ms ease, opacity 180ms ease";

  element.style.opacity = "0";

  element.style.transform =
    direction === "right"
      ? "translateX(120px)"
      : "translateX(-120px)";

  window.setTimeout(() => {
    if (direction === "right") {
      const nextStatus =
        book.status === "owned"
          ? "wishlist"
          : "owned";

      updateBook(book.id, {
        status: nextStatus
      });

      notify({
        title:
          nextStatus === "owned"
            ? "marked owned"
            : "moved to wishlist",

        text: book.title
      });

      return;
    }

    const confirmed =
      window.confirm(
        `remove "${book.title}" from collection?`
      );

    if (!confirmed) {
      resetTransform(element);

      element.style.opacity = "1";

      return;
    }

    deleteBook(book.id);

    notify({
      title: "book deleted",
      text: book.title
    });
  }, 160);
}

function attachSwipe(
  element,
  book
) {
  let startX = 0;

  let startY = 0;

  let currentX = 0;

  let active = false;

  element.style.touchAction =
    "pan-y";

  element.addEventListener(
    "touchstart",
    (event) => {
      const point =
        getPoint(event);

      startX = point.clientX;

      startY = point.clientY;

      currentX = 0;

      active = true;
    },
    {
      passive: true
    }
  );

  element.addEventListener(
    "touchmove",
    (event) => {
      if (!active) {
        return;
      }

      const point =
        getPoint(event);

      const deltaX =
        point.clientX - startX;

      const deltaY =
        point.clientY - startY;

      if (
        Math.abs(deltaY) >
        MAX_VERTICAL_DRIFT
      ) {
        active = false;

        resetTransform(element);

        return;
      }

      currentX = deltaX;

      applyTransform(
        element,
        deltaX
      );
    },
    {
      passive: true
    }
  );

  element.addEventListener(
    "touchend",
    () => {
      if (!active) {
        return;
      }

      active = false;

      if (
        Math.abs(currentX) <
        SWIPE_THRESHOLD
      ) {
        resetTransform(element);

        return;
      }

      commitAction({
        element,

        direction:
          currentX > 0
            ? "right"
            : "left",

        book
      });
    }
  );

  element.addEventListener(
    "touchcancel",
    () => {
      active = false;

      resetTransform(element);
    }
  );
}

export function initializeSwipeActions({
  selector,
  books
}) {
  if (
    !window.matchMedia(
      "(pointer: coarse)"
    ).matches
  ) {
    return;
  }

  document
    .querySelectorAll(selector)
    .forEach((element) => {
      const id =
        element.dataset.bookId;

      const book = books.find(
        (item) =>
          item.id === id
      );

      if (!book) {
        return;
      }

      attachSwipe(
        element,
        book
      );
    });
}
