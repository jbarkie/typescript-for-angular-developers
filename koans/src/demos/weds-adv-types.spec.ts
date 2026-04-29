
import { describe, expect, it } from "vitest";
import { Book, retireBook, sortBooks } from "./library";

describe("More Advanced Types", () => {


    it('Sorting Demo', () => {
     const books:Book[] = [
        { id: '1', title: 'Effective JavaScript', author: 'Byrne', yearReleased: 2020 },
        { id: '2', title: 'Rando Book', author: 'Smythe', yearReleased: 1969}
     ];

     const sorted = sortBooks(books, 'rating-ascending');
    })

    it("utility types", () => {
        type PartOfBook = Partial<Book>; // makes every Book property optional
        type NewType = Required<Book>; // if there's an optional property, required
        type ReadonlyType = Readonly<Book>; //

        const b1: Book = {
            id: '1',
            title: 'Effective JavaScript',
            author: 'Byrne',
            yearReleased: 2020
        }

        const b1Retired = retireBook(b1);

        expect(b1.yearReleased).toBe(2020);
        expect(b1Retired.yearReleased).toBe(2020);
        expect(b1Retired.retiredDate).toBe('today');
    })
})