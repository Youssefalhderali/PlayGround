import { parseQuery } from "./utils.js";

let listener = null;
let routes = [];

export function parseHash(hash = window.location.hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const [pathPart, queryPart = ""] = raw.split("?");
  let path = pathPart || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+$/, "") || "/";
  return { path, query: parseQuery(queryPart) };
}

export function matchRoute(path) {
  const segments = path.split("/").filter(Boolean);
  for (const route of routes) {
    const pattern = route.path.split("/").filter(Boolean);
    if (route.path === "*") return { route, params: {} };
    if (pattern.length !== segments.length) continue;
    const params = {};
    let ok = true;
    for (let index = 0; index < pattern.length; index += 1) {
      const part = pattern[index];
      if (part.startsWith(":")) {
        params[part.slice(1)] = decodeURIComponent(segments[index]);
      } else if (part !== segments[index]) {
        ok = false;
        break;
      }
    }
    if (ok) return { route, params };
  }
  return { route: routes.find((route) => route.path === "*") || null, params: {} };
}

export function startRouter(handler) {
  routes = handler.routes || routes;
  listener = () => {
    const { path, query } = parseHash();
    const { route, params } = matchRoute(path);
    handler.onRoute({ path, query, route, params });
  };
  window.addEventListener("hashchange", listener);
  if (!window.location.hash) {
    history.replaceState(null, "", "#/");
  }
  listener();
  return () => stopRouter();
}

export function stopRouter() {
  if (listener) window.removeEventListener("hashchange", listener);
  listener = null;
}

export function navigate(path, { replace = false } = {}) {
  const target = `#${String(path).startsWith("/") ? path : `/${path}`}`;
  if (replace) {
    history.replaceState(null, "", target);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = target;
}

export function currentPath() {
  return parseHash().path;
}

export function href(path, query) {
  const queryText = query ? new URLSearchParams(query).toString() : "";
  return `#${path}${queryText ? `?${queryText}` : ""}`;
}

export function isActive(path, target) {
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
}
