import { describe, test, it, expect } from 'vitest';
import { fizzBuzz, max, calculateAverage, factorial } from '../src/intro';

describe('max', () => {
  it('Should return first argument if it is grater', () =>
    expect(max(2, 1)).toBe(2));

  it('Should return second argument if it is grater', () =>
    expect(max(1, 2)).toBe(2));

  it('Should return first argument if arguments are equal', () =>
    expect(max(1, 1)).toBe(1));
});

// --------------------------------

describe('fizzBuzz', () => {
  it('Should return "FizzBuzz" if the argument is  divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('Should return "Fizz" if the argument is only divisible by 3', () => {
    expect(fizzBuzz(3)).toBe('Fizz');
  });

  it('Should return "Buzz" if the argument is only divisible by 5', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });

  it('Should return "Buzz" a string if the argument is not divisible  ', () => {
    expect(fizzBuzz(5)).toBe('Buzz');
  });

  it('should return string', () => {
    expect(fizzBuzz(4)).toBe('4');
  });
});

// --------------------------------

describe('calculateAverage', () => {
  it('should return NaN if it given empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });
  it('should calculate the average of an array with single element', () => {
    expect(calculateAverage([1])).toBe(1);
  });
  it('should calculate the average of an array with two element', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });
  it('should calculate the average of an array with three element', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

// --------------------------------

describe('factorial', () => {
  it('should return 1 for given 0', () => {
    expect(factorial(0)).toBe(1);
  });
  it('should return 1 for given 1', () => {
    expect(factorial(1)).toBe(1);
  });
  it('should return 2 for given 2', () => {
    expect(factorial(2)).toBe(2);
  });
  it('should return 24 for given 24', () => {
    expect(factorial(3)).toBe(6);
  });
  it('should return 24 for given 4', () => {
    expect(factorial(4)).toBe(24);
  });
  it('should return undefine for given negative number', () => {
    expect(factorial(-1)).toBeUndefined;
  });
});
