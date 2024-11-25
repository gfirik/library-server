import { z } from "zod";

const BookSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
});

// user schema
export const UserSchema = z.object({
  telegram_user_id: z.number().positive(),
  username: z.string().nullable(),
  books_read: z.array(BookSchema).default([]),
  books_reading: z.array(BookSchema).max(2).default([]),
  firstname: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;
