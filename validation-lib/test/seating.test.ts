import { describe, expect, it } from "vitest";
import { getSeatCost } from "../src";

describe("seating", () => {
    it("does stuff", () => {
        expect(getSeatCost('window')).toBe(110.23);
    })
})