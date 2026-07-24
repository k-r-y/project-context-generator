---
name: client-side-routing
description: Use when implementing or modifying in-app navigation, route transitions, or URL-to-view mapping in a single-page application.
---

# Client-Side Routing

## When to use this
> Commonly paired or confused with: server-side-rendering, global-state-management. See those skills if this one doesn't match the task.

Use when implementing or modifying in-app navigation, route transitions, or URL-to-view mapping in a single-page application. This skill applies when working in the **Frontend Development** domain.

## How it works
Intercepts URL changes to update the view without requesting a new HTML page from the server.

**Why it matters:** Creates seamless, native-app-like transitions in Single Page Applications.

## Steps
1. Implement route-level code splitting to dynamically load JavaScript chunks on demand.
2. Prefetch critical route data and assets when the user hovers over a navigation link.
3. Maintain a robust 404 fallback and redirect unauthorized users at the route level.

## Never do this
- Do not block route transitions with heavy synchronous operations.
- Do not break the browser's native back/forward button behavior.
- Do not store sensitive authorization logic entirely on the client router.