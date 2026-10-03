const PRESS_DEDUPE_WINDOW_MS = 600;

/**
 * Attaches a unified "press" behavior to a pane button.
 *
 * Sidebar panes re-render while a press can still be in progress (for
 * example, the first click moves workspace focus and triggers
 * `active-leaf-change` refreshes). A re-render between `mousedown` and
 * `mouseup` removes the button from the DOM, so the browser never dispatches
 * `click` and the press is silently swallowed - the "two clicks to activate"
 * symptom.
 *
 * To keep single-press semantics reliable:
 * - Left `mousedown` triggers the action immediately, with `preventDefault`
 *   (keeps editor focus and selection) and `stopPropagation` (keeps nested
 *   buttons from activating their container's handler).
 * - `click` remains the keyboard path (Enter/Space) and is de-duplicated
 *   against an immediate mousedown press within a short time window.
 */
export function attachPressHandler(button: HTMLButtonElement, onPress: () => void): void {
  let lastPointerPressAt = 0;

  button.addEventListener('mousedown', (event) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    lastPointerPressAt = Date.now();
    onPress();
  });

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (Date.now() - lastPointerPressAt < PRESS_DEDUPE_WINDOW_MS) {
      return;
    }
    onPress();
  });
}
