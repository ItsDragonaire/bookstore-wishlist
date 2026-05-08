const modalRoot = document.createElement("div");

modalRoot.className = "modal-root";
modalRoot.setAttribute("aria-hidden", "true");

document.body.append(modalRoot);

let activeCleanup = null;

function closeModal() {
  modalRoot.classList.remove("is-visible");
  modalRoot.setAttribute("aria-hidden", "true");

  document.body.classList.remove("scroll-lock");

  setTimeout(() => {
    modalRoot.innerHTML = "";

    activeCleanup?.();
    activeCleanup = null;
  }, 180);
}

export function openModal({
  title,
  description = "",
  content,
  onClose
}) {
  activeCleanup = onClose || null;

  modalRoot.innerHTML = `
    <div class="modal-backdrop"></div>

    <section
      class="modal-panel"
      role="dialog"
      aria-modal="true"
      aria-label="${title}"
    >
      <header class="modal-header">
        <div>
          <h2 class="modal-title">${title}</h2>

          ${
            description
              ? `
                <p class="modal-description">
                  ${description}
                </p>
              `
              : ""
          }
        </div>

        <button
          class="modal-close"
          type="button"
          aria-label="close modal"
        >
          ×
        </button>
      </header>

      <div class="modal-content"></div>
    </section>
  `;

  modalRoot
    .querySelector(".modal-content")
    .append(content);

  modalRoot.classList.add("is-visible");
  modalRoot.setAttribute("aria-hidden", "false");

  document.body.classList.add("scroll-lock");

  modalRoot
    .querySelector(".modal-backdrop")
    .addEventListener("click", closeModal);

  modalRoot
    .querySelector(".modal-close")
    .addEventListener("click", closeModal);

  document.addEventListener(
    "keydown",
    handleEscape
  );

  requestAnimationFrame(() => {
    content.querySelector(
      "input, textarea, select"
    )?.focus();
  });
}

function handleEscape(event) {
  if (event.key !== "Escape") {
    return;
  }

  document.removeEventListener(
    "keydown",
    handleEscape
  );

  closeModal();
}

export { closeModal };
