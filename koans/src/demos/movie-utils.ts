export type Movie = {
    title: string;
    readonly director: string;
    yearReleased: number;
    mpaaRating?: string; // ? means it's now an optional property
}

export function getMovieSummary(movie: Movie) {
    return `${movie.title} by ${movie.director} was released in ${movie.yearReleased}.`;
}