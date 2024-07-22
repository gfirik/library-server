import { escapeHtml } from "../../services/escapeHTML";
import { supabase } from "../../supabase/supabase";
import bot from "../main";
import { sendMessageToUsers } from "../sendMessageToUsers";

interface Order {
  user_id: string;
  book_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_screenshot?: string;
}

interface OrderPayload {
  new: Order;
}

const handleNewOrderInsert = async (payload: OrderPayload) => {
  console.log("New order received:", payload.new);

  const newOrder = payload.new;

  try {
    // Fetch book title
    const { data: bookData, error: bookError } = await supabase
      .from("books")
      .select("title")
      .eq("id", newOrder.book_id)
      .single();

    if (bookError) {
      throw new Error(`Error fetching book data: ${bookError.message}`);
    }

    const message = `<b>A new order has been placed!</b>\n\n
      Book: <i>${escapeHtml(bookData.title)}</i>
      Start Date: ${new Date(newOrder.start_date).toLocaleDateString()}
      End Date: ${new Date(newOrder.end_date).toLocaleDateString()}
      Total Price: $${newOrder.total_price.toFixed(2)}
      Status: ${newOrder.status}

      New order received!`;

    console.log("Prepared message:", message);

    // Fetch all users
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("telegram_user_id");

    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }

    console.log("Fetched users:", users);

    await sendMessageToUsers(bot, [{ telegram_user_id: 433734174 }], message);
    console.log("Messages sent successfully");
  } catch (error) {
    console.error("Error in handleNewOrderInsert:", error);
  }
};

function setupRealtimeListener() {
  const channel = supabase
    .channel("public:orders")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      handleNewOrderInsert
    )
    .subscribe((status) => {
      console.log("Subscription status:", status);
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to orders");
      }
      if (status === "CHANNEL_ERROR") {
        console.error("Channel error, will retry in 5 seconds");
        setTimeout(setupRealtimeListener, 5000);
      }
    });

  return channel;
}

let channel = setupRealtimeListener();

console.log("Order listener setup complete");

export default channel;
