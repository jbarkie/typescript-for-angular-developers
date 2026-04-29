import { describe, it } from 'vitest';

class Customer {
  name = '';
  availableCredit = 0;

  sendJunkMail() {
    // do some junk mailing.
  }
}

class Vendor {
  creditLimit = 999;
}

describe('Discriminated Unions', () => {
  it('deleteme', () => {
    // const b = new Customer();
    const b = {
      availableCredit: 3000,
      name: 'Paul',
      sendJunkMail: () => console.log('Sending Customer Junkmail'),
    };
  
  });

  it('type narrowing', () => {
    display('bird');
    display(99);
    display(false);

    function display(value: string | number | boolean) {
      if (typeof value === 'string') {
        return value.toUpperCase(); // string here
      } else if (typeof value === 'number') {
        return value.toFixed(2); // number here
      }

      return String(value); // boolean here
    }
  });

  it('type validation function', () => {
    type Cat = { meow(): void };
    type Dog = { bark(): void };
    type Animal = Cat | Dog;

    const bailey = {
      meow: () => console.log('Screech'),
    };
    if (isCat(bailey)) {
      bailey.meow();
    }

    function isCat(animal: unknown): animal is Cat {
      return typeof animal === 'object' && animal !== null && 'meow' in animal;
    }
  });
});
