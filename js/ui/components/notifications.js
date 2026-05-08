const MAX_NOTIFICATIONS = 4;

let stack =
  document.querySelector(
    ".notification-stack"
  );

if (!stack) {
  stack =
    document.createElement(
      "section"
    );

  stack.className =
    "notification-stack";

  stack.setAttribute(
    "aria-live",
    "polite"
  );

  stack.setAttribute(
    "aria-label",
    "notifications"
  );

  document.body.append(stack);
}

function buildNotification({
  title,
  text,
  type = "info"
}) {
  const element =
    document.createElement(
      "article"
    );

  element.className =
    `notification notification--${type}`;

  element.setAttribute(
    "role",
    "status"
  );
  
  element.setAttribute(
    "aria-atomic",
    "true"
  );
  
  if (type === "error") {
    element.setAttribute(
      "role",
      "alert"
    );
  }

  element.innerHTML = `
    <div class="notification__content">
      <h3 class="notification__title">
        ${title}
      </h3>

      ${
        text
          ? `
          <p class="notification__text">
            ${text}
          </p>
        `
          : ""
      }
    </div>

    <button
      class="notification__close"
      type="button"
      aria-label="dismiss notification"
    >
      ×
    </button>
  `;

  element
    .querySelector(
      ".notification__close"
    )
    .addEventListener(
      "click",
      () => {
        removeNotification(
          element
        );
      }
    );

  return element;
}

function removeNotification(
  element
) {
  if (!element) {
    return;
  }

  element.classList.add(
    "is-removing"
  );

  window.setTimeout(() => {
    element.remove();
  }, 180);
}

function trimNotifications() {
  const notifications = [
    ...stack.children
  ];

  if (
    notifications.length <=
    MAX_NOTIFICATIONS
  ) {
    return;
  }

  notifications
    .slice(
      0,
      notifications.length -
        MAX_NOTIFICATIONS
    )
    .forEach(removeNotification);
}

export function notify({
  title,
  text = "",
  type = "info",
  duration = 3200
}) {
  const notification =
    buildNotification({
      title,
      text,
      type
    });

  stack.append(notification);

  trimNotifications();

  requestAnimationFrame(() => {
    notification.classList.add(
      "is-visible"
    );
  });

  if (duration <= 0) {
    return;
  }

  window.setTimeout(() => {
    removeNotification(
      notification
    );
  }, duration);
}
