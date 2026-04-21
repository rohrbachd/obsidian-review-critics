import { describe, expect, it } from 'vitest';
import { ChangeResolutionService } from '../../src/change-resolution';
import type { TrackedChangeEntry } from '../../src/review-types';

describe('change-resolution service', () => {
  const service = new ChangeResolutionService();

  it('accepts all tracked changes', () => {
    const input = '{++a++} {--b--} {~~old~>new~~}';
    expect(service.resolveAllTrackedChangesAsAccepted(input)).toBe('a  new');
  });

  it('resolves single addition and substitution by action', () => {
    const addition: TrackedChangeEntry = {
      id: 'a',
      type: 'addition',
      from: 0,
      to: 8,
      line: 1,
      heading: 'Document root',
      context: '{++x++}',
      text: 'x',
    };
    const substitution: TrackedChangeEntry = {
      id: 's',
      type: 'substitution',
      from: 0,
      to: 13,
      line: 1,
      heading: 'Document root',
      context: '{~~o~>n~~}',
      oldText: 'o',
      newText: 'n',
    };

    expect(service.resolveTrackedChange('{++x++}', addition, 'accept')).toBe('x');
    expect(service.resolveTrackedChange('{++x++}', addition, 'reject')).toBe('');
    expect(service.resolveTrackedChange('{~~o~>n~~}', substitution, 'accept')).toBe('n');
    expect(service.resolveTrackedChange('{~~o~>n~~}', substitution, 'reject')).toBe('o');
  });

  it('rejects tracked change by markup and restores old text correctly', () => {
    expect(service.rejectTrackedChangeByMarkup('a{++new++}b', '{++new++}')).toBe('ab');
    expect(service.rejectTrackedChangeByMarkup('a{--old--}b', '{--old--}')).toBe('aoldb');
    expect(service.rejectTrackedChangeByMarkup('a{~~old~>new~~}b', '{~~old~>new~~}')).toBe('aoldb');
  });
});
