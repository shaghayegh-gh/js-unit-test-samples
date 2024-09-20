import { vi, it, expect, describe, afterEach } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
  signUp,
  login,
  isOnline,
  getDiscount,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalMethod = await importOriginal();
  return {
    ...originalMethod,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    const greet = vi.fn();
    /* 
   1. mockReturnValue
   2. mockResolveValue
   3. mockReturnImplementation
 */
    //--------------------------------
    /* greet.mockReturnValue('Hello');
    const result = greet();
    console.log(result); // ===> 'Hello' */

    //--------------------------------

    /* greet.mockResolvedValue('Hello');
    greet().then((result) => console.log(result));*/

    //--------------------------------

    greet.mockImplementation((name) => 'Hello ' + name);
    const result = greet('Shaghayegh');
    console.log(result);

    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith('Shaghayegh');
    expect(greet).toHaveBeenCalledOnce();
  });
});

describe('example test', () => {
  it('test case 2', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');
    const result = sendText('message');

    expect(sendText).toHaveBeenCalledWith('message');
    expect(result).toBe('ok');
  });
});

//--------------------------------

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');
    expect(price).toBe(15);
  });
});

//--------------------------------

describe('getShippingInfo', () => {
  it('should return quote unavailable it quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('London');
    expect(result).toMatch(/unavailable/i);
  });

  it('should return fetching info if quote can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 10,
      estimatedDays: 2,
    });
    const result = getShippingInfo('London');
    // expect(result).toMatch('$10');
    // expect(result).toMatch(/2 days/i);
    expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i);
  });
});

//--------------------------------

describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    const result = await renderPage();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

//--------------------------------

describe('submitOrder', () => {
  const order = {
    totalAmount: 10,
  };
  const creditCard = {
    creditCardNumber: 1234,
  };

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });

  it('should return failed when payment is failed', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
});

//--------------------------------

describe('signUp', () => {
  const email = 'name@domain.com';
  // afterEach(() => {
  //   vi.mocked(sendEmail).mockClear();
  //   OR
  //   vi.clearAllMocks();
  // });

  it('should retune false it email is not valid', async () => {
    const result = await signUp('notEmail');
    expect(result).toBe(false);
  });

  it('should return true if the email is valid', async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });

  it('should send an welcome email', async () => {
    signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();

    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).match(/welcome/i);
  });
});

//--------------------------------

describe('login', () => {
  const email = 'name@domain.com';
  it('should email the ont-time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode');
    await login(email);

    const securityCode = spy.mock.results[0].value.toString();

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

//--------------------------------

describe('isOnline', () => {
  it('should return false if current hour  is outside of opening hovers', () => {
    vi.setSystemTime('2024-01-01 7:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if current hour  is within of opening hovers', () => {
    vi.setSystemTime('2024-01-01 8:00');
    expect(isOnline()).toBe(true);
    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

//--------------------------------

describe('getDiscount', () => {
  it('should return 0.2 on christmas day', () => {
    vi.setSystemTime('20204-12-25 00:01');
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime('20204-12-25 023:59');
    expect(getDiscount()).toBe(0.2);
  });

  it('should return 0 on any other  day', () => {
    vi.setSystemTime('20204-12-24 00:01');
    expect(getDiscount()).toBe(0);

    vi.setSystemTime('20204-12-26 023:59');
    expect(getDiscount()).toBe(0);
  });
});
