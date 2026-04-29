import { z} from 'zod';

export const BookApiItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    yearReleased: z.number()
})

export const BookApiItemsSchema = z.array(BookApiItemSchema)


export type BookApiItem = z.infer<typeof BookApiItemSchema>;
