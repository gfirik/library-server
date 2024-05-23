import { supabase } from "../supabase/supabase";
import bot from "./main";

interface Book {
  title: string;
  author: string;
  description: string;
  published: number;
}

interface Payload {
  new: Book;
}

const handleNewBookInsert = async (payload: Payload) => {
  const newBook = payload.new;

  const message = ` 
    A new book has been added to the library!
    Title: ${newBook.title}
    Author: ${newBook.author}
    Description: ${newBook.description}
    Published Year: ${newBook.published}
  `;

  const { data: users, error } = await supabase
    .from("users")
    .select("telegram_user_id");

  if (error) {
    console.error("Error fetching users", error);
    return;
  }

  for (const user of users) {
    try {
      await bot.api.sendMessage(user.telegram_user_id, message);
    } catch (error) {
      console.error(
        `Error sending message to user ${user.telegram_user_id}`,
        error
      );
    }
  }
};

supabase
  .channel("public:books")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "books" },
    handleNewBookInsert
  )
  .subscribe();
