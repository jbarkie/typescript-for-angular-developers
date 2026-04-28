//#region src/types.d.ts
type ValidationResult = {
  valid: true;
} | {
  valid: false;
  message: string;
};
type Validator<T> = (value: T) => ValidationResult;
//#endregion
//#region src/internal/validators.d.ts
declare const ok: {
  valid: true;
};
declare const fail: (message: string) => {
  valid: false;
  message: string;
};
/**
 * This is a way to compose n number of validator functions into one validator
 * @param validators
 * @returns ValidationResult
 */
declare const compose: <T>(...validators: Validator<T>[]) => Validator<T>;
declare const exactLength: (n: number) => (value: string) => ValidationResult;
declare const min: (n: number) => Validator<number>;
declare const max: (n: number) => Validator<number>;
declare const email: Validator<string>;
declare const url: Validator<string>;
//#endregion
//#region src/internal/advanced-validators.d.ts
declare const isValidCreditCard: Validator<string>;
//#endregion
//#region src/internal/string-validators.d.ts
declare const required: Validator<string>;
declare const minLength: (n: number) => Validator<string>;
declare const maxLength: (n: number) => Validator<string>;
//#endregion
export { compose, email, exactLength, fail, isValidCreditCard, max, maxLength, min, minLength, ok, required, url };
//# sourceMappingURL=index.d.mts.map