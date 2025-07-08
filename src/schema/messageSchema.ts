import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(6, "Content atleast must be of 6 characters.")
        .max(300, "Content must be no longer then 300 characters.")
})