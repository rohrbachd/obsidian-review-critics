// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { attachPressHandler } from '../../src/press-activation';

function pressMouseLeft(button: HTMLButtonElement): void {
  button.dispatchEvent(
    new MouseEvent('mousedown', { button: 0, bubbles: true, cancelable: true })
  );
}

function pressMouseRight(button: HTMLButtonElement): void {
  button.dispatchEvent(
    new MouseEvent('mousedown', { button: 2, bubbles: true, cancelable: true })
  );
}

function click(button: HTMLButtonElement): void {
  button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('press-activation', () => {
  it('triggers the action on left mousedown', () => {
    const button = document.createElement('button');
    const onPress = vi.fn();
    attachPressHandler(button, onPress);

    pressMouseLeft(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores non-left mousedown', () => {
    const button = document.createElement('button');
    const onPress = vi.fn();
    attachPressHandler(button, onPress);

    pressMouseRight(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('dedupes the click that follows a mousedown press', () => {
    const button = document.createElement('button');
    const onPress = vi.fn();
    attachPressHandler(button, onPress);

    pressMouseLeft(button);
    click(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('still triggers on click for keyboard activation', () => {
    const button = document.createElement('button');
    const onPress = vi.fn();
    attachPressHandler(button, onPress);

    click(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not let a nested button press bubble into the container handler', () => {
    const container = document.createElement('button');
    const nested = document.createElement('button');
    container.appendChild(nested);

    const onContainerPress = vi.fn();
    const onNestedPress = vi.fn();
    attachPressHandler(container, onContainerPress);
    attachPressHandler(nested, onNestedPress);

    pressMouseLeft(nested);

    expect(onNestedPress).toHaveBeenCalledTimes(1);
    expect(onContainerPress).not.toHaveBeenCalled();
  });

  it('prevents default on mousedown so editor focus is kept', () => {
    const button = document.createElement('button');
    const onPress = vi.fn();
    attachPressHandler(button, onPress);

    const event = new MouseEvent('mousedown', {
      button: 0,
      bubbles: true,
      cancelable: true,
    });
    button.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
