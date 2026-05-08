let activeModal = null;

function createOverlay() {
  const overlay =
    document.createElement(
      "div"
    );

  overlay.className =
    "modal-overlay";

  return overlay;
}

function trapFocus(
  container
) {
  const selectors = [
    "button",
    "a[href]",
    "input",
    "select",
    "textarea",
    "[tabindex]:not([tabindex='-1'])"
  ];

  const focusables = [
    ...container.querySelectorAll(
      selectors.join(",")
    )
  ];

  const first =
    focusables[0];

  const last =
    focusables.at(-1);

  container.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Tab"
      ) {
        return;
      }

      if (
        event.shiftKey &&
        document.activeElement ===
          first
      ) {
        event.preventDefault();

        last?.focus();
      }

      if (
        !event.shiftKey &&
        document.activeElement ===
          last
      ) {
        event.preventDefault();

        first?.focus();
      }
    }
  );

  first?.focus();
}

export function closeModal() {
  if (!activeModal) {
    return;
  }

  activeModal.classList.add(
    "is-closing"
  );

  document.body.classList.remove(
    "modal-open"
  );

  window.setTimeout(() => {
    activeModal?.remove();

    activeModal = null;
  }, 180);
}

export function openModal({
  title,
  description = "",
  content,
  size = "default"
}) {
  closeModal();

  const overlay =
    createOverlay();

  const modal =
    document.createElement(
      "section"
    );

  modal.className =
    `modal modal--${size}`;

  modal.setAttribute(
    "role",
    "dialog"
  );

  modal.setAttribute(
    "aria-modal",
    "true"
  );

  modal.innerHTML = `
    <header class="modal__header">
      <div>
        <h2 class="modal__title">
          ${title}
        </h2>

        ${
          description
            ? `
            <p class="modal__description">
              ${description}
            </p>
          `
            : ""
        }
      </div>

      <button
        class="modal__close"
        type="button"
        aria-label="close dialog"
      >
        ×
      </button>
    </header>

    <div class="modal__content"></div>
  `;

  modal
    .querySelector(
      ".modal__close"
    )
    .addEventListener(
      "click",
      closeModal
    );

  overlay.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        overlay
      ) {
        closeModal();
      }
    }
  );

  window.addEventListener(
    "keydown",
    handleEscape
  );

  function handleEscape(
    event
  ) {
    if (
      event.key ===
      "Escape"
    ) {
      closeModal();

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    }
  }

  const contentRoot =
    modal.querySelector(
      ".modal__content"
    );

  if (content) {
    contentRoot.append(
      content
    );
  }

  overlay.append(modal);

  document.body.append(
    overlay
  );

  document.body.classList.add(
    "modal-open"
  );

  activeModal = overlay;

  requestAnimationFrame(() => {
    overlay.classList.add(
      "is-visible"
    );
  });

  trapFocus(modal);

  return modal;
}
