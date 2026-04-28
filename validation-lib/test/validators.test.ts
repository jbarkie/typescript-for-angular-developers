import { describe, expect, it } from "vitest";
import { compose, email, exactLength, max, maxLength, min, minLength, required, url } from "../src";

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
        
        const scValidator = exactLength(2);
        expect(scValidator("OH").valid).toBe(true);
        expect(scValidator("O").valid).toBe(false);
    });

    describe("Min and Max Numbers", () => {
        it("does minimum", () => {
            const minOf10 = min(10);
            expect(minOf10(10).valid).toBe(true);
            expect(minOf10(9).valid).toBe(false);
        });

        it("does maximum", () => {
            const maxOf10 = max(10);
            expect(maxOf10(10).valid).toBe(true);
            expect(maxOf10(11).valid).toBe(false);
        });
    });

    describe("Email Addresses", () => {
        it('does email', () => {
            const validEmailAddr = "testing@test.com";
            const invalidEmailAddr = "@testing";

            expect(email(validEmailAddr).valid).toBe(true);
            expect(email(invalidEmailAddr).valid).toBe(false);
        })
    });

    describe("Url", () => {
        it('does URL', () => {
            const validURL = "https://www.test.com/";
            const invalidURL = "./test.exe";

            expect(url(validURL).valid).toBe(true);
            expect(url(invalidURL).valid).toBe(false);
        })
    });

    describe.skip("Credit Card Number using Mod 10 / Luhn", () => {

    });
})