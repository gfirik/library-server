import { escapeHtml } from "../../services/escapeHTML";
import { supabase } from "../../supabase/supabase";
import env from "../../utils/env";
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

const adminTelegramId = env.ADMIN_TELEGRAM_ID;

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

    const message = `<b>Buyurtmangiz</b>\n\nKitob: <i>${escapeHtml(
      bookData.title
    )}</i>\nBoshlanish: ${new Date(
      newOrder.start_date
    ).toLocaleDateString()}\nYakuniy sana: ${new Date(
      newOrder.end_date
    ).toLocaleDateString()}\nUmumiy narx: ${newOrder.total_price.toFixed(
      2
    )}KRW\nBuyurtma holati: ${
      newOrder.status
    }\n\nIjara buyurtmangizni tasdiqlash uchun quyidagi hisob raqamiga umumiy ko'rsatilgan narxni jo'nating.\nHisob egasi: <b>GAFURJONOV</b>\nHisob raqam: <b>111222333444555666</b>\nBank: <b>KEB Hana Bank</b>\n\nTo'lovni amalga oshirgandan so'ng bemalol ijaraga olayotgan kitobingizni olib ketish uchun belgilagan sanangizdan boshlab tashrif buyurishingiz mumkin.\n\nBuyurtmangiz uchun tashakkur!`;

    console.log("Prepared message:", message);

    // Send message to the specific user
    await bot.api.sendMessage(userData.telegram_user_id, message, {
      parse_mode: "HTML",
    });
    console.log("Confirmation message sent successfully");

    const adminMessage = `<b>Yangi buyurtma qabul qilindi!</b>\n\nFoydalanuvchi Telegram ID: ${
      userData.telegram_user_id
    }\nKitob: <i>${escapeHtml(bookData.title)}</i>\nBoshlanish: ${new Date(
      newOrder.start_date
    ).toLocaleDateString()}\nYakuniy sana: ${new Date(
      newOrder.end_date
    ).toLocaleDateString()}\nUmumiy narx: ${newOrder.total_price.toFixed(
      2
    )}KRW\nBuyurtma holati: ${newOrder.status}`;

    if (adminTelegramId) {
      await bot.api.sendMessage(adminTelegramId, adminMessage, {
        parse_mode: "HTML",
      });
      console.log("Admin notification sent successfully");
    }
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
      console.log("Order Subscription status:", status);
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
