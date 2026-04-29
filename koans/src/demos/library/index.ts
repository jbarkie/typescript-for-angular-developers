  export  type Book = {
        id: string;
        title: string;
        author: string;
        yearReleased: number;
        rating?: number;
    }

    export type SortDirection = 'ascending' | 'descending';
    type SortableColumns = keyof Pick<Book, 'title' | 'author' | 'yearReleased' | 'rating'>;
    type SortOptions = `${SortableColumns}-${SortDirection}` // template literal type

    function assertNever(value: never): never {
        throw new Error("Runtime error if outside typescript")
    }

    export function sortBooks (
        books:Book[], 
        options: SortOptions
    ): Book[] {
        switch(options) {
            case 'author-ascending':
            case 'author-descending':
            default:
             //   assertNever(options);
        }
        return books;
    }

    interface RetiredBookInterface extends Book {
        retiredDate: string;
    }

    type RetiredBook = Book & {
        retiredDate: string;
    }

    export function retireBook(book: Readonly<Book>): RetiredBook {
        const retiredBook: RetiredBook = {...book, retiredDate: 'today '};

        return retiredBook;
    }