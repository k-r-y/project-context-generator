---
name: design-systems
description: Use when building, extending, or auditing a shared library of reusable components, tokens, and usage guidelines across a product or organization.
---

# Design Systems

## When to use this
> Commonly paired or confused with: component-architecture, css-in-js, high-fidelity-prototyping. See those skills if this one doesn't match the task.

Use when building, extending, or auditing a shared library of reusable components, tokens, and usage guidelines across a product or organization. This skill applies when working in the **UI/UX Design** domain.

## How it works
Creates reusable component libraries, tokens, and guidelines.

**Why it matters:** Ensures visual consistency across the product and accelerates development velocity.

## Steps
1. Define all visual primitives as semantic design tokens (e.g., color.background.primary).
2. Build components using atomic design principles (atoms, molecules, organisms).
3. Document the exact 'do's and don'ts' for every component's usage.

## Never do this
- Do not allow hardcoded hex values or pixel sizes in component implementations.
- Do not create one-off components for specific pages; always generalize.
- Do not decouple the Figma library from the actual code repository components.
- Do not use purple gradient
- Do not use emojis