import { openModal } from "../ui/components/modal.js";

import { notify } from "../ui/components/notifications.js";

const STORAGE_KEY =
  "bookstore:pwa-install-dismissed";

let deferredPrompt = null;

let installed = false;

function isStandalone() {
  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||
    window.navigator.standalone ===
      true
  );
}

function wasDismissed() {
  return (
    localStorage.getItem(
      STORAGE_KEY
    ) === "true"
  );
}

function markDismissed() {
  localStorage.setItem(
    STORAGE_KEY,
    "true"
  );
}

function clearDismissed() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

function createInstallPanel() {
  const wrapper =
    document.createElement(
      "section"
    );

  wrapper.className =
    "form-grid";

  wrapper.innerHTML = `
    <div class="form-field">
      <h3 class="modal__title">
        install bookstore wishlist
      </h3>

      <p class="modal__description">
        install the app for faster access, offline support, and a cleaner app-like experience
      </p>
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="button button--secondary"
        id="dismiss-install"
      >
        not now
      </button>

      <button
        type="button"
        class="button button--primary"
        id="confirm-install"
      >
        install app
      </button>
    </div>
  `;

  wrapper
    .querySelector(
      "#dismiss-install"
    )
    .addEventListener(
      "click",
      () => {
        markDismissed();

        notify({
          title:
            "install dismissed",

          text:
            "you can install later from the toolbar"
        });

        document
          .querySelector(
            ".modal__close"
          )
          ?.click();
      }
    );

  wrapper
    .querySelector(
      "#confirm-install"
    )
    .addEventListener(
      "click",
      async () => {
        if (
          !deferredPrompt
        ) {
          return;
        }

        deferredPrompt.prompt();

        const result =
          await deferredPrompt.userChoice;

        if (
          result.outcome ===
          "accepted"
        ) {
          installed = true;

          clearDismissed();

          notify({
            title:
              "app installed",

            text:
              "bookstore wishlist is ready offline",

            type:
              "success"
          });
        }

        deferredPrompt = null;

        document
          .querySelector(
            ".modal__close"
          )
          ?.click();
      }
    );

  return wrapper;
}

export function openInstallPrompt() {
  if (
    !deferredPrompt ||
    installed ||
    isStandalone()
  ) {
    notify({
      title:
        "installation unavailable",

      text:
        "your browser does not currently support app installation"
    });

    return;
  }

  openModal({
    title: "install app",

    description:
      "save bookstore wishlist to your device",

    content:
      createInstallPanel(),

    size: "compact"
  });
}

export function initializeInstallPrompt() {
  if (isStandalone()) {
    return;
  }

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      event.preventDefault();

      deferredPrompt =
        event;

      if (
        wasDismissed()
      ) {
        return;
      }

      window.setTimeout(
        () => {
          if (
            deferredPrompt &&
            !installed
          ) {
            openInstallPrompt();
          }
        },
        2200
      );
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      installed = true;

      deferredPrompt =
        null;

      clearDismissed();

      notify({
        title:
          "installation complete",

        text:
          "the app is now available from your home screen",

        type:
          "success"
      });
    }
  );
}
