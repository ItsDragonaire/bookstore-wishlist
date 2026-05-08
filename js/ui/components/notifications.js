const stack = document.createElement("div");

stack.className = "notification-stack";

document.body.append(stack);

export function notify({
  title,
  text = ""
}) {
  const item = document.createElement("article");

  item.className = "notification";

  item.innerHTML = `
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
  `;

  stack.append(item);

  setTimeout(() => {
    item.remove();
  }, 3200);
}
