const { supabase } = require("src/config/configSupabase");

const uploadImage = (name, image) =>
  supabase.storage
    .from("charges")
    .upload(name, image, {
      cacheControl: "3600",
      upsert: false,
    })
    .then((result) => console.log(result));

const getUrlImage = (name) =>
  supabase.storage.from("charges").getPublicUrl(name);

export { uploadImage, getUrlImage };
