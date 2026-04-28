import type { ValidationResult, Validator } from "./types";

const ok: { valid: true } = { valid: true }
const fail = (message: string): { valid: false; message: string } => ({
        valid: false,
        message // if name of property and param are the same, you don't need to specify param like message:message
})

export const required: Validator<string> = (value) => 
    value.trim().length > 0 ? ok : fail('value is required')


export const minLength = 
(n: number) : Validator<string> => 
(value) => value.length >= n ? ok : fail(`must be at least ${n} characters`)

export const maxLength = 
(n: number) : Validator<string> => 
(value) => value.length <= n ? ok : fail(`must be at least ${n} characters`)

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
(value: string) => compose(minLength(n), maxLength(n))

/*
export function required(value: string) {
    if (value.trimEnd().length > 0) {
        return ok;
    } else {
        return fail('value is required')
    }
}
*/ 


