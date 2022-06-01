const { supabase } = require("src/config/configSupabase");

const createDiscount = (DiscountData) =>
  supabase
    .from("Discount")
    .insert(DiscountData)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const updateDiscount = (DiscountData, discountID) =>
  supabase
    .from("Discount")
    .update(DiscountData)
    .eq("ID", discountID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

export { createDiscount, updateDiscount };
