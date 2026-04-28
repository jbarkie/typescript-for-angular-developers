import type { Validator } from "../types"
import { fail, ok } from "./validators"

export const required: Validator<string> = (value) => 
    value.trim().length > 0 ? ok : fail('value is required')


export const minLength = 
(n: number) : Validator<string> => 
(value) => value.length >= n ? ok : fail(`must be at least ${n} characters`)

export const maxLength = 
(n: number) : Validator<string> => 
(value) => value.length <= n ? ok : fail(`must be at least ${n} characters`)
