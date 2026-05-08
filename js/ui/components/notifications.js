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
  element.classList.add(
    "is-removing"
  );

  window.setTimeout(() => {
    element.remove();
  }, 180);
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

  requestAnimationFrame(() => {
    notification.classList.add(
      "is-visible"
    );
  });

  window.setTimeout(() => {
    removeNotification(
      notification
    );
  }, duration);
}
