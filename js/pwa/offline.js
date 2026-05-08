import { notify } from "../ui/components/notifications.js";

let online =
  navigator.onLine;

function updateDomState(
  connected
) {
  document.documentElement.dataset.online =
    connected
      ? "true"
      : "false";

  document.body.setAttribute(
    "data-online",
    connected
      ? "true"
      : "false"
  );

  document.body.classList.toggle(
    "is-offline",
    !connected
  );
}

function handleOffline() {
  online = false;

  updateDomState(false);

  notify({
    title:
      "offline mode enabled",

    text:
      "saved books remain available locally",

    type:
      "info",

    duration: 5000
  });
}

function handleOnline() {
  const wasOffline =
    !online;

  online = true;

  updateDomState(true);

  if (wasOffline) {
    notify({
      title:
        "connection restored",

      text:
        "metadata lookup and syncing are available again",

      type:
        "success"
    });
  }
}

export function isOffline() {
  return !online;
}

export function initializeOfflineState() {
  updateDomState(
    navigator.onLine
  );

  window.addEventListener(
    "offline",
    handleOffline
  );

  window.addEventListener(
    "online",
    handleOnline
  );

  if (!navigator.onLine) {
    handleOffline();
  }
}
