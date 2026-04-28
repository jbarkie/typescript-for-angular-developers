import { describe, expect, it } from "vitest";
import { compose, exactLength, maxLength, minLength, required } from "../src";

describe("required", () => {
    it("passes for a non-empty string", () => {
           expect(required("hello")).toEqual({ valid: true});
    });

    it
    .each(["", " ", "     "])
    ("fails for an empty string", (input: string) => {
        const result = required(input);
        expect(result.valid).toBe(false);
        // more coming soon
        if (!result.valid) {
            expect(result.message).toBe("value is required")
        }
    });

    it('minLength passes', () => {
        const atLeastFiveLettersLong = minLength(5); // higher order function
        expect(atLeastFiveLettersLong("12345").valid).toBe(true);
    });

    it('minLength fails on four', () => {
        const v = minLength(4);
        const result = v("dog");
        expect(result.valid).toBe(false);
        if (!result.valid) {
            expect(result.message).toBe('must be at least 4 characters')
        }

        var bad = minLength(100)("pizza");

    });

    it('maxLength', () => {
        const stateCodeValidator = compose(
            required, 
            maxLength(2), 
            minLength(2)
        ); // functional composition
        expect(stateCodeValidator("OH").valid).toBe(true);
        expect(stateCodeValidator("O").valid).toBe(false);
        
        // const scValidator = exactLength(2);
        // expect(scValidator("OH").valid).toBe(true);
        // expect(scValidator("O").valid).toBe(false);

    });

    describe.skip("Min and Max Numbers", () => {

    });

    describe.skip("Email Addresses", () => {
        
    });

    describe.skip("Url", () => {

    });
})