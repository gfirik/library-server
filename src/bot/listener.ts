import { supabase } from "../supabase/supabase";
import bot from "./main";
import { sendMessageToUsers } from "./sendMessageToUsers";

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

  const escapeHtml = (text: string) =>
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const message = `<b>A new book has been added to the library!</b>\n\nTitle: <i>${escapeHtml(
    newBook.title
  )}</i>\nAuthor: <i>${escapeHtml(
    newBook.author
  )}</i>\nDescription: ${escapeHtml(newBook.description)}\nPublished Year: ${
    newBook.published
  }`;

  const { data: users, error } = await supabase
    .from("users")
    .select("telegram_user_id");

  if (error) {
    console.error("Error fetching users", error);
    return;
  }

  await sendMessageToUsers(bot, users, message);
};

supabase
  .channel("public:books")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "books" },
    handleNewBookInsert
  )
  .subscribe();
