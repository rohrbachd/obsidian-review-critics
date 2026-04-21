// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { ReviewQuickActionsView } from '../../src/quick-actions-view';

describe('quick-actions view', () => {
  it('renders all quick action buttons and triggers callbacks', async () => {
    const onAction = vi.fn().mockResolvedValue(true);
    const view = new ReviewQuickActionsView({} as never, onAction);
    await view.onOpen();

    const buttons = view.contentEl.querySelectorAll('button');
    expect(buttons.length).toBe(5);

    (buttons[0] as HTMLButtonElement).click();
    expect(onAction).toHaveBeenCalledWith('add');
  });
});
