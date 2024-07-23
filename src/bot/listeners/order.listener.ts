import { escapeHtml } from "../../services/escapeHTML";
import { supabase } from "../../supabase/supabase";
import bot from "../main";

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

    // Fetch user's Telegram ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("telegram_user_id")
      .eq("id", newOrder.user_id)
      .single();

    if (userError) {
      throw new Error(`Error fetching user data: ${userError.message}`);
    }

    const message = `<b>Buyurtmangiz</b>\n\n
      Kitob: <i>${escapeHtml(bookData.title)}</i>\n
      Boshlanish: ${new Date(newOrder.start_date).toLocaleDateString()}\n
      Yakuniy sana: ${new Date(newOrder.end_date).toLocaleDateString()}\n
      Umumiy narx: ${newOrder.total_price.toFixed(2)}KRW\n
      Buyurtma holati: ${newOrder.status}\n\n
      
      Ijara buyurtmangizni tasdiqlash uchun quyidagi hisob raqamiga umumiy ko'rsatilgan narxni jo'nating.\n
      Hisob egasi: <b>GAFURJONOV FIRDAVS</b>\n
      Hisob raqam: <b>74891134496607</b>\n
      Bank: <b>KEB Hana Bank</b>\n
      
      Jo'natmangizning screenshot'ini esa shu xabarga javob (reply) qilib yuboring:\n\n
      Buyurtmangiz uchun tashakkur!`;

    console.log("Prepared message:", message);

    // Send message to the specific user
    await bot.api.sendMessage(userData.telegram_user_id, message, {
      parse_mode: "HTML",
    });
    console.log("Confirmation message sent successfully");
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

export default channel;
