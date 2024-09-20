import { describe, it, expect, beforeEach } from 'vitest';
import {
  Stack,
  calculateDiscount,
  canDrive,
  fetchData,
  fetchDataReject,
  getCoupons,
  isPriceInRange,
  validateUserInput,
} from '../src/core';

describe('getCoupons', () => {
  it('should return an array of coupons', () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should return an array with valid property codes ', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
    });
  });

  it('should return an array with valid property discount', () => {
    const coupon = getCoupons();
    coupon.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

// --------------------------------

describe('calculateDiscount', () => {
  it('should return discount if given valid number code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
  });

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });

  it('should handel non-sting discount code', () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it('should handel invalid code discount', () => {
    expect(calculateDiscount(10, '')).toBe(10);
  });
});

// --------------------------------

describe('validateUserInput', () => {
  it('should return successful for given valid inputs', () => {
    expect(validateUserInput('Shay', 31)).toMatch(/successful/i);
  });

  it('should handel non-sting username', () => {
    expect(validateUserInput(1, 31)).toMatch(/invalid/i);
  });

  it('should return in invalid if username length is less than 3', () => {
    expect(validateUserInput('sh', 31)).toMatch(/invalid/i);
  });
  it('should return in invalid if username length is more than 255', () => {
    expect(validateUserInput('A'.repeat(256), 31)).toMatch(/invalid/i);
  });

  it('should handle non-numeric age', () => {
    expect(validateUserInput('shay', '31')).toMatch(/invalid/i);
  });

  it('should return invalid if age is less than 18', () => {
    expect(validateUserInput('shay', 17)).toMatch(/invalid/i);
  });

  it('should return invalid if age is greater than 100', () => {
    expect(validateUserInput('shay', 101)).toMatch(/invalid/i);
  });

  it('should return an error if both username an age are invalid', () => {
    expect(validateUserInput('', 0)).toMatch(/invalid username/i);
    expect(validateUserInput('', 0)).toMatch(/invalid age/i);
  });
});

// --------------------------------

describe('isPriceInRange', () => {
  //out of boundary
  // it('should return the false if the price is out of the range', () => {
  //   expect(isPriceInRange(-10, 0, 100)).toBe(false);
  //   expect(isPriceInRange(200, 0, 100)).toBe(false);
  // });

  //at the  boundary
  // it('should return true if the price is equal to the min or max', () => {
  //   expect(isPriceInRange(0, 0, 100)).toBe(true);
  //   expect(isPriceInRange(100, 0, 100)).toBe(true);
  // });

  // in the boundary
  // it('should return true if price is with in the range', () => {
  //   expect(isPriceInRange(50, 0, 100)).toBe(true);
  // });

  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price > max', price: 200, result: false },
    { scenario: 'price = min', price: 0, result: true },
    { scenario: 'price = max', price: 100, result: true },
    { scenario: 'min <price < max', price: 50, result: true },
  ])(
    'should return the $result if the $price is out of range',
    ({ price, min, max, result }) => {
      expect(isPriceInRange(price, 0, 100)).toBe(result);
    }
  );
});

// --------------------------------

describe('canDrive', () => {
  // it('should return an error for invalid county code', () => {
  //   expect(canDrive(18, '')).toMatch(/invalid/i);
  // });

  // it('should return false for under age in the UK', () => {
  //   expect(canDrive(16, 'UK')).toBe(false);
  // });
  // it('should return true for min age in the UK', () => {
  //   expect(canDrive(17, 'UK')).toBe(true);
  // });
  // it('should return true for eligible age in the UK', () => {
  //   expect(canDrive(18, 'UK')).toBe(true);
  // });

  // it('should return false for under age in the US', () => {
  //   expect(canDrive(15, 'US')).toBe(false);
  // });
  // it('should return true for min age in the US', () => {
  //   expect(canDrive(16, 'US')).toBe(true);
  // });
  // it('should return true for eligible age in the US', () => {
  //   expect(canDrive(17, 'US')).toBe(true);
  // });
  it.each([
    { age: 15, countryCode: 'US', result: false },
    { age: 16, countryCode: 'US', result: true },
    { age: 17, countryCode: 'US', result: true },
    { age: 16, countryCode: 'UK', result: false },
    { age: 17, countryCode: 'UK', result: true },
    { age: 18, countryCode: 'UK', result: true },
  ])(
    'should return $result for $age , $countryCode',
    ({ age, result, countryCode }) => {
      expect(canDrive(age, countryCode)).toBe(result);
    }
  );
});

// --------------------------------

describe('fetchData', () => {
  it('should return a promise that resolve an array of number', () => {
    fetchData().then((result) => {
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('fetchData', () => {
  it('should return a promise that resolve an array of number', async () => {
    const result = await fetchData();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('fetchDataReject', () => {
  it('should return a promise that reject', async () => {
    try {
      const result = await fetchDataReject();
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

// --------------------------------

describe('stack', () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });
  it('push should add item to the stack', () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it('pop should remove and return the top item from the stack', () => {
    stack.push(1);
    stack.push(2);
    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it('pop should return an error if the stack is empty', () => {
    expect(() => stack.pop()).throw(/empty/i);
  });

  it('peek should return the top item whit out removing it', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);

    const peekItem = stack.peek();

    expect(peekItem).toBe(3);
    expect(stack.size()).toBe(3);
  });

  it('peek should return an error if the stack is empty', () => {
    expect(() => stack.peek()).throw(/empty/i);
  });

  it('isEmpty should return true if the stack is empty', () => {
    expect(stack.isEmpty()).toBeTruthy();
  });

  it('isEmpty should return false if the stack is not empty', () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it('size should return the number of the items in stack', () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it('clear should remove all items from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
