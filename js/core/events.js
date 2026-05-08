const listeners = new Map();

export function on(
  eventName,
  handler
) {
  if (!listeners.has(eventName)) {
    listeners.set(
      eventName,
      new Set()
    );
  }

  listeners
    .get(eventName)
    .add(handler);

  return () => {
    listeners
      .get(eventName)
      ?.delete(handler);
  };
}

export function once(
  eventName,
  handler
) {
  const unsubscribe = on(
    eventName,
    (payload) => {
      unsubscribe();

      handler(payload);
    }
  );
}

export function emit(
  eventName,
  payload
) {
  const handlers =
    listeners.get(eventName);

  if (!handlers) {
    return;
  }

  handlers.forEach(
    (handler) => {
      handler(payload);
    }
  );
}

export function clearEvent(
  eventName
) {
  listeners.delete(
    eventName
  );
}
