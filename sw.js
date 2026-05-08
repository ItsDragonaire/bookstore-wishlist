const CACHE_VERSION =
  "bookstore-cache-v1";

const APP_SHELL_CACHE =
  `${CACHE_VERSION}-shell`;

const API_CACHE =
  `${CACHE_VERSION}-api`;

const MAX_API_CACHE_ITEMS = 40;

const APP_SHELL_FILES = [
  "./",
  "./index.html",

  "./manifest.webmanifest",

  "./css/base.css",
  "./css/layout.css",
  "./css/themes.css",
  "./css/components.css",
  "./css/utilities.css",
  "./css/print.css",

  "./js/app.js",

  "./js/config.js",

  "./js/core/schema.js",
  "./js/core/state.js",
  "./js/core/storage.js",
  "./js/core/events.js",

  "./js/utils/csv.js",
  "./js/utils/json.js",

  "./js/api/openlibrary.js",
  "./js/api/googlebooks.js",
  "./js/api/metadata.js",
  "./js/api/barcode.js",

  "./js/ui/components/modal.js",
  "./js/ui/components/toolbar.js",
  "./js/ui/components/bookForm.js",
  "./js/ui/components/filters.js",
  "./js/ui/components/bulkEditor.js",
  "./js/ui/components/scanner.js",
  "./js/ui/components/notifications.js",

  "./js/ui/views/tableView.js",
  "./js/ui/views/cardView.js",
  "./js/ui/views/printView.js",

  "./js/ui/interactions/dragdrop.js",
  "./js/ui/interactions/keyboard.js",
  "./js/ui/interactions/swipeActions.js"
];

async function trimCache(
  cacheName,
  maxItems
) {
  const cache =
    await caches.open(
      cacheName
    );

  const keys =
    await cache.keys();

  if (
    keys.length <= maxItems
  ) {
    return;
  }

  await cache.delete(
    keys[0]
  );

  return trimCache(
    cacheName,
    maxItems
  );
}

async function cacheAppShell() {
  const cache =
    await caches.open(
      APP_SHELL_CACHE
    );

  await cache.addAll(
    APP_SHELL_FILES
  );
}

async function clearOldCaches() {
  const keys =
    await caches.keys();

  return Promise.all(
    keys.map((key) => {
      if (
        !key.startsWith(
          CACHE_VERSION
        )
      ) {
        return caches.delete(
          key
        );
      }
    })
  );
}

async function cacheFirst(
  request
) {
  const cached =
    await caches.match(
      request
    );

  if (cached) {
    return cached;
  }

  try {
    const response =
      await fetch(request);

    if (
      response &&
      response.ok
    ) {
      const cache =
        await caches.open(
          APP_SHELL_CACHE
        );

      cache.put(
        request,
        response.clone()
      );
    }

    return response;
  } catch {
    return new Response(
      "offline",
      {
        status: 503,
        headers: {
          "Content-Type":
            "text/plain"
        }
      }
    );
  }
}

async function networkFirst(
  request
) {
  const cache =
    await caches.open(
      API_CACHE
    );

  try {
    const response =
      await fetch(request);

    if (
      response &&
      response.ok
    ) {
      cache.put(
        request,
        response.clone()
      );
      trimCache(
        API_CACHE,
        MAX_API_CACHE_ITEMS
      );
    }

    return response;
  } catch {
    const cached =
      await cache.match(
        request
      );

    if (cached) {
      return cached;
    }

    return new Response(
      JSON.stringify({
        error:
          "offline unavailable"
      }),
      {
        status: 503,

        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );
  }
}

function isApiRequest(url) {
  return (
    url.includes(
      "openlibrary.org"
    ) ||
    url.includes(
      "googleapis.com"
    )
  );
}

self.addEventListener(
  "install",
  (event) => {
    event.waitUntil(
      cacheAppShell()
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  (event) => {
    event.waitUntil(
      Promise.all([
        clearOldCaches(),
        self.clients.claim()
      ])
    );
  }
);

self.addEventListener(
  "fetch",
  (event) => {
    const request =
      event.request;

    if (
      request.method !== "GET"
    ) {
      return;
    }

    const url =
      request.url;

    if (
      isApiRequest(url)
    ) {
      event.respondWith(
        networkFirst(
          request
        )
      );

      return;
    }

    event.respondWith(
      cacheFirst(request)
    );
  }
);
