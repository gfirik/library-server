import { escapeHtml } from "../../services/escapeHTML.ts";
import { supabase } from "../../supabase/supabase.ts";
import bot from "../main.ts";
import { sendMessageToUsers } from "../sendMessageToUsers.ts";

interface Book {
  title: string;
  author: string;
  description: string;
  published: number;
  status: string;
}

interface Payload {
  new: Book;
}

const handleNewBookInsert = async (payload: Payload) => {
  const newBook = payload.new;

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

const handleBookStatusUpdate = async (payload: Payload) => {
  const updatedBook = payload.new;

  if (updatedBook.status === "Available") {
    const message = `<b>A book is now available!</b>\n\nTitle: <i>${escapeHtml(
      updatedBook.title
    )}</i>\nAuthor: <i>${escapeHtml(
      updatedBook.author
    )}</i>\nDescription: ${escapeHtml(
      updatedBook.description
    )}\nPublished Year: ${updatedBook.published}`;

    const { data: users, error } = await supabase
      .from("users")
      .select("telegram_user_id");

    if (error) {
      console.error("Error fetching users", error);
      return;
    }

    await sendMessageToUsers(bot, users, message);
  }
};

supabase
  .channel("public:books")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "books" },
    handleNewBookInsert
  )
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "books" },
    handleBookStatusUpdate
  )
  .subscribe((status) => {
    console.log("Book Subcscription status:", status);

    if (status === "SUBSCRIBED") {
      console.log("Successfully subscribed to books");
    }
  });
