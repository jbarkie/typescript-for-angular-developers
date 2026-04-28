import { describe, expect, it } from 'vitest';
import { getMovieSummary } from './movie-utils';

// Behavior Drive Style - Dan North created this
describe('objects', () => {
    it('object literals', () => {

        const age = 13;

        type Movie = {
            title: string;
            readonly director: string;
            yearReleased: number;
            mpaaRating?: string; // ? means it's now an optional property
        }

        const starWars: Movie = {
            title: 'Episode IV: A New Hope', 
            director: 'Lucas',
            yearReleased: 1978,
            mpaaRating: 'PG'
        }

        starWars.yearReleased = 1977;

        expect(starWars.yearReleased).toBe(1977);
        expect(starWars['yearReleased']).toBe(1977); // indexer
        
        const empireStrikesBack = {
            title: 'Episode V: The Empire Strikes Back',
            director: 'Kershner',
            yearReleased: 1981,
            // this object can still be passed to getMovieSummary() -> as long as it conforms to the Movie type, regardless of extra junk
            cast: [
                { role: 'Luke', actor: 'Mark Hamill'}
            ]
        }

        const s1 = getMovieSummary(starWars);

        // expect(s1).toBe('blah');

        // "Structural Typing" - super rad, super dangerous
        // Duck Typing - if it walks like a duck...
        const s2 = getMovieSummary(empireStrikesBack);

    });

    it('Arrays', () => {
        type NumberOrString = number | string;
        let luckyNumbers: NumberOrString[];
        let bestFriends: Array<string | number>;

        luckyNumbers = [1, 3, ]
    });


    it('array mutations', () => {
        const nums = [1, 2, 3, 4, 5];

        const reversed = nums.toReversed();
    })
})