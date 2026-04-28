export type ValidationResult = 
    | { valid: true }
    | { valid: false, message: string };

export type Validator<T> = (value: T) => ValidationResult;