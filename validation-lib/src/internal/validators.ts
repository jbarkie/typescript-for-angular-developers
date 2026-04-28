import { maxLength, minLength } from "./string-validators";
import type { ValidationResult, Validator } from "../types";

export const ok: { valid: true } = { valid: true }
export const fail = (message: string): { valid: false; message: string } => ({
        valid: false,
        message // if name of property and param are the same, you don't need to specify param like message:message
})

// below is JSDoc, a way to document TS and JS functions

/**
 * This is a way to compose n number of validator functions into one validator
 * @param validators 
 * @returns ValidationResult
 */
export const compose =
<T>(...validators: Validator<T>[]): Validator<T> =>
(value) : ValidationResult => {
    for (const v of validators) {
        const result = v(value);
        if (!result.valid) return result;
    }
    return ok;
}

export const exactLength =
(n: number) =>
(value: string): ValidationResult => compose(minLength(n), maxLength(n))(value)

export const min = 
(n: number): Validator<number> =>
(value) =>  value >= n ? ok : fail(`must be at least ${n}`)

export const max = 
(n: number): Validator<number> =>
(value) =>  value <= n ? ok : fail(`must be at most ${n}`)

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const email: Validator<string> = (value) =>
    emailRegex.test(value) ? ok : fail("must be valid email address");

const urlRegex: RegExp = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

export const url: Validator<string> = (value) => {
    try {
        new URL(value);
        return ok;
    } catch {
        return fail('must be valid URL');
    }
}

export const isEven = 
(n: number) => (value: number): ValidationResult =>
    value % 2 === 0 ? ok : fail('must be even')

/*
export function required(value: string) {
    if (value.trimEnd().length > 0) {
        return ok;
    } else {
        return fail('value is required')
    }
}
*/ 


