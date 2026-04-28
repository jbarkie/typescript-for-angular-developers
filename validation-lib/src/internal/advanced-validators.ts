// uses Luhn algorithm to validate credit card numbers
// https://en.wikipedia.org/wiki/Luhn_algorithm

import type { Validator } from "../types";

// This is just an example of a more complex validator that doesn't fit the simple patterns of the built-in ones.
export const isValidCreditCard: Validator<string> = (number) => {
  const clean = number.replace(/\D/g, "");

  if (clean.length === 0) {
    return { valid: false, message: "Must be a valid credit card number" };
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0
    ? { valid: true }
    : { valid: false, message: "Must be a valid credit card number" };
};
