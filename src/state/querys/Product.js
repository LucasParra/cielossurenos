import { supabase } from "src/config/configSupabase";

const getProducts = (limit) =>
  supabase
    .from("Product")
    .select("*")
    .limit(limit * 5 + 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const getProductByIDUser = (UserID) =>
  supabase
    .from("UserProduct")
    .select("*,ProductID(*)")
    .eq("UserID", UserID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const countProductUsed = (productID) =>
  supabase
    .from("UserProduct")
    .select("*", { count: "exact" })
    .eq("ProductID", productID)
    .then(({ count }) => count);

export { getProducts, getProductByIDUser, countProductUsed };
