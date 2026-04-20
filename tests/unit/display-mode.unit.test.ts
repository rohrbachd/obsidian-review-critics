import { describe, expect, it } from 'vitest';
import { DisplayModeRenderer } from '../../src/display-mode';

describe('display-mode renderer', () => {
  const renderer = new DisplayModeRenderer();

  it('renders accepted text for each tracked change token', () => {
    expect(
      renderer.renderAcceptedTextForToken({ type: 'addition', from: 0, to: 1, text: 'a' })
    ).toBe('a');
    expect(
      renderer.renderAcceptedTextForToken({ type: 'deletion', from: 0, to: 1, text: 'x' })
    ).toBe('');
    expect(
      renderer.renderAcceptedTextForToken({
        type: 'substitution',
        from: 0,
        to: 1,
        oldText: 'old',
        newText: 'new',
      })
    ).toBe('new');
  });
});
