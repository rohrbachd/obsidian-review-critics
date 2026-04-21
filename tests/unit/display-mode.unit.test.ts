import { describe, expect, it } from 'vitest';
import { DisplayModeRenderer } from '../../src/display-mode';
import { ReviewParser } from '../../src/review-parser';

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

  it('resolves full-document accepted text for structural markdown payloads', () => {
    const parser = new ReviewParser();
    const source = '{++# Heading++}\n{--gone--}\n{~~old~>- item~~}';

    const resolved = renderer.resolveAcceptedText(source, parser);

    expect(resolved).toContain('# Heading');
    expect(resolved).toContain('- item');
    expect(resolved).not.toContain('gone');
    expect(resolved).not.toContain('{++');
    expect(resolved).not.toContain('{~~');
  });
});
