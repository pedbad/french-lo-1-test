/**
 * Tests for the shared sentence parser used by fill-blank exercises.
 *
 * These tests capture the EXACT behaviour of the three former per-component
 * `parseSentence` copies (SelectExercise, InlineChoiceGroup = choice blanks;
 * InlineTypedGapExercise = input blanks) so the extraction is provably
 * behaviour-preserving.
 */
import { describe, expect, it } from 'vitest';
import {
  parseChoiceBlank,
  parseInputBlank,
  parseSentence,
} from './exerciseParsing';

describe('parseSentence — segment structure', () => {
  it('splits leading text, blank, and trailing text in order', () => {
    const blanksMeta = [];
    const { segments, nextBlankIndex } = parseSentence('Je [suis|*es] ici.', {
      startBlankIndex: 0,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });

    expect(segments).toEqual([
      { key: 'text-0-0', type: 'text', value: 'Je ' },
      { blankIndex: 0, key: 'choice-0', type: 'choice' },
      { key: 'tail-1-13', type: 'text', value: ' ici.' },
    ]);
    expect(nextBlankIndex).toBe(1);
  });

  it('handles multiple blanks and advances blankIndex', () => {
    const blanksMeta = [];
    const { segments, nextBlankIndex } = parseSentence('[a|*b] et [*c|d]', {
      startBlankIndex: 0,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });

    const choiceSegments = segments.filter((s) => s.type === 'choice');
    expect(choiceSegments).toEqual([
      { blankIndex: 0, key: 'choice-0', type: 'choice' },
      { blankIndex: 1, key: 'choice-1', type: 'choice' },
    ]);
    expect(nextBlankIndex).toBe(2);
  });

  it('respects a non-zero startBlankIndex (multi-phrase continuation)', () => {
    const blanksMeta = [];
    const { segments, nextBlankIndex } = parseSentence('x [a|*b] y', {
      startBlankIndex: 3,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });

    expect(segments.find((s) => s.type === 'choice')).toMatchObject({
      blankIndex: 3,
      key: 'choice-3',
    });
    expect(nextBlankIndex).toBe(4);
    expect(blanksMeta[3]).toBeDefined();
  });

  it('emits no text segment when a blank sits at the very start', () => {
    const blanksMeta = [];
    const { segments } = parseSentence('[a|*b] tail', {
      startBlankIndex: 0,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });
    expect(segments[0]).toEqual({ blankIndex: 0, key: 'choice-0', type: 'choice' });
  });

  it('decodes HTML entities in text segments', () => {
    const blanksMeta = [];
    const { segments } = parseSentence("l&apos;[a|*b]", {
      startBlankIndex: 0,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });
    expect(segments[0]).toEqual({ key: 'text-0-0', type: 'text', value: "l'" });
  });

  it('returns only a tail text segment when there are no blanks', () => {
    const blanksMeta = [];
    const { segments, nextBlankIndex } = parseSentence('plain text', {
      startBlankIndex: 0,
      blanksMeta,
      parseBlank: parseChoiceBlank,
    });
    expect(segments).toEqual([
      { key: 'tail-0-0', type: 'text', value: 'plain text' },
    ]);
    expect(nextBlankIndex).toBe(0);
  });
});

describe('parseChoiceBlank', () => {
  it('parses options, marks the starred winner, strips the asterisk', () => {
    const { meta, segment } = parseChoiceBlank('suis|*es|est', 0);
    expect(meta).toEqual({ options: ['suis', 'es', 'est'], winner: 1 });
    expect(segment).toEqual({ blankIndex: 0, key: 'choice-0', type: 'choice' });
  });

  it('returns winner -1 when no option is starred', () => {
    const { meta } = parseChoiceBlank('a|b|c', 0);
    expect(meta.winner).toBe(-1);
  });

  it('trims whitespace and decodes entities in options', () => {
    const { meta } = parseChoiceBlank(' l&apos;an | *deux ', 0);
    expect(meta.options).toEqual(["l'an", 'deux']);
    expect(meta.winner).toBe(1);
  });
});

describe('parseInputBlank', () => {
  it('parses expected answer and computes width', () => {
    const { meta, segment } = parseInputBlank('mange', 0);
    expect(meta).toEqual({
      expected: 'mange',
      placeholder: '',
      widthCh: Math.max('mange'.length, 6) + 2, // 8
    });
    expect(segment).toEqual({ blankIndex: 0, key: 'input-0', type: 'input' });
  });

  it('splits expected::placeholder on the double colon', () => {
    const { meta } = parseInputBlank('réponse::tape ici', 0);
    expect(meta.expected).toBe('réponse');
    expect(meta.placeholder).toBe('tape ici');
  });

  it('decodes entities before splitting', () => {
    const { meta } = parseInputBlank("l&apos;an", 0);
    expect(meta.expected).toBe("l'an");
  });

  it('uses a minimum width of 8 for short answers', () => {
    const { meta } = parseInputBlank('a', 0);
    expect(meta.widthCh).toBe(8); // max(1,6)+2
  });
});
