import { describe, it, expect } from 'vitest';

describe('test suit string', () => {
  it('test case ', () => {
    const result = 'the response file was not found.';

    // Loose (too general)
    expect(result).toBeDefined();

    // Tight (too specific)
    expect(result).toBe('the response file was not found.');

    // Better assertion
    expect(result).toMatch(/not found/i);
  });
});

describe('test suit array', () => {
  it('test case', () => {
    const result = [1, 2, 3];

    //Loose
    expect(result).toBeDefined();

    // Thigh
    expect(result).toEqual([1, 2, 3]);

    // Better assertion

    //# Not depended on the order of elements
    expect(result).toEqual(expect.arrayContaining([1, 2, 3]));

    //# have 3 length
    expect(result).toHaveLength(3);

    //# have length
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('test suit object', () => {
  it('test case', () => {
    const result = { name: 'mosh' };

    //  Loose
    expect(result).toBeDefined();

    //  Tight
    expect(result).toEqual({ name: 'mosh' });

    //  Better assertion
    expect(result).toMatchObject({ name: 'mosh' });
    expect(result).toHaveProperty('name');
    expect(typeof result.name).toBe('string');
  });
});
