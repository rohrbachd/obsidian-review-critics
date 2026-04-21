import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('us5 changes pane integration', () => {
  const parser = new ReviewParser();

  it('maps tracked changes with heading+line and resolves quickly', () => {
    const input = '# Intro\n{++a++}\n{--b--}\n{~~old~>new~~}\n';
    const started = performance.now();
    const entries = parser.buildTrackedChangeEntries(input);
    const elapsed = performance.now() - started;

    expect(entries).toHaveLength(3);
    expect(entries[0].heading).toBe('Intro');
    expect(entries[0].line).toBe(2);
    expect(elapsed).toBeLessThan(5000);
  });

  it('does not include bypassed structural markdown edits when no tracked tokens exist', () => {
    const input = '# Heading\n- item\n> [!NOTE] Callout\n| A | B |\n| --- | --- |\n| x | y |';
    const entries = parser.buildTrackedChangeEntries(input);
    expect(entries).toHaveLength(0);
  });
});
