/**
 * Tests for shared answer-normalization helpers.
 *
 * Captures the exact behaviour of the former per-component copies:
 *  - normalizeAnswer  (InlineTypedGapExercise.normalizeAnswer): light normalize
 *  - normalizeForDictation (TextEntry + exerciseDiff normalizeForDictationCompare):
 *    light normalize + punctuation/quote stripping
 *
 * Accents are intentionally NOT stripped (é stays é) — French content relies on
 * accent-sensitive grading.
 */
import { describe, expect, it } from 'vitest';
import { normalizeAnswer, normalizeForDictation } from './answerNormalize';

describe('normalizeAnswer (light)', () => {
  it('normalizes curly/back apostrophes to straight', () => {
    expect(normalizeAnswer("l’an")).toBe("l'an");   // right single quote
    expect(normalizeAnswer('l`an')).toBe("l'an");          // backtick
    expect(normalizeAnswer('l´an')).toBe("l'an");    // acute accent
  });

  it('collapses internal whitespace and trims ends', () => {
    expect(normalizeAnswer('  je   suis  ')).toBe('je suis');
  });

  it('preserves accents (NFC, no stripping)', () => {
    expect(normalizeAnswer('  étudiant ')).toBe('étudiant');
  });

  it('does NOT strip punctuation (light mode keeps it)', () => {
    expect(normalizeAnswer('Bonjour!')).toBe('Bonjour!');
    expect(normalizeAnswer('a, b.')).toBe('a, b.');
  });

  it('handles empty / non-string input', () => {
    expect(normalizeAnswer('')).toBe('');
    expect(normalizeAnswer()).toBe('');
  });
});

describe('normalizeForDictation (full)', () => {
  it('does everything light does', () => {
    expect(normalizeForDictation("  l’an  ")).toBe("l'an");
  });

  it('replaces sentence punctuation with space (then collapses)', () => {
    expect(normalizeForDictation('Bonjour, ça va?')).toBe('Bonjour ça va');
    expect(normalizeForDictation('a.b,c!d?e;f:g…h')).toBe('a b c d e f g h');
  });

  it('replaces guillemets and curly quotes with space', () => {
    expect(normalizeForDictation('«oui»')).toBe('oui');
    expect(normalizeForDictation('“non”')).toBe('non');
  });

  it('preserves accents', () => {
    expect(normalizeForDictation('Ça été élevé.')).toBe('Ça été élevé');
  });

  it('treats punctuation-only differences as equal after normalize', () => {
    expect(normalizeForDictation('Oui, merci!')).toBe(normalizeForDictation('Oui merci'));
  });

  it('handles empty / non-string input', () => {
    expect(normalizeForDictation('')).toBe('');
    expect(normalizeForDictation()).toBe('');
  });
});
