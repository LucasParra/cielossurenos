import moment from "moment";

const { supabase } = require("src/config/configSupabase");

const getCharges = (limit) =>
  supabase
    .from("ChargeType")
    .select("*")
    .limit(limit * 5 + 1)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const createCharge = (chargesData) =>
  supabase
    .from("Charge")
    .insert(chargesData)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const deleteCharge = (ID) =>
  supabase
    .from("Charge")
    .delete()
    .match({ ID })
    .then((snapshot) => snapshot.data);

const updateCharge = (chargesData, ID) =>
  supabase
    .from("Charge")
    .update(chargesData)
    .eq("ID", ID)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const chargeAutomatic = () =>
  supabase
    .from("User")
    .select("*")
    .eq("RolID", 2)
    .then((snapshot) => {
      const users = snapshot.data;
      users.map((user) =>
        supabase
          .from("UserProduct")
          .select("Product(*),ID,Price")
          .eq("UserID", user.ID)
          .then((productSnapshot) => {
            const products = productSnapshot.data;
            if (products.length === 0) return null;

            return createCharge({
              ChargeTypeID: 7,
              CreatedAt: moment().toDate(),
              Charge: products.reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue.Product.BasePrice,
                0
              ),
              ClientID: user.ID,
              State: false,
              Remaining: 0,
            });
          })
      );
    })
    .catch(console.error);

const getChargeUserID = (UserID) =>
  supabase
    .from("Charge")
    .select("*,ChargeTypeID(*)")
    .eq("ClientID", UserID)
    .eq("State", false)
    .then(({ data }) => data);

const getAllChargeUserID = (UserID) =>
  supabase
    .from("Charge")
    .select("*,ChargeTypeID(*)")
    .eq("ClientID", UserID)
    .order("CreatedAt", { ascending: true })
    .then((snapshot) => snapshot.data);

const createPay = (ID, UrlImage, DocumentData) =>
  supabase
    .from("Charge")
    .update({
      State: true,
      UrlImage,
      DocumentID: DocumentData.id,
      UrlDocument: DocumentData.urlPublicView,
    })
    .eq("ID", ID)
    .then((snapshot) => snapshot.data);

const createTypeCharge = (dataCharge) =>
  supabase
    .from("ChargeType")
    .insert(dataCharge)
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const getTypeCharge = () =>
  supabase
    .from("ChargeType")
    .select("*")
    .then((snapshot) => snapshot.data)
    .catch(console.error);

const updateChargeType = (ID, data) =>
  supabase.from("ChargeType").update(data).eq("ID", ID);

const deleteChargeType = (ID) =>
  supabase
    .from("ChargeType")
    .delete()
    .match({ ID })
    .then((snapshot) => snapshot.data);

const countChargeAssigned = (ChargeTypeID) =>
  supabase
    .from("Charge")
    .select("*", { count: "exact" })
    .eq("ChargeTypeID", ChargeTypeID)
    .then(({ count }) => count);

export {
  createCharge,
  deleteCharge,
  updateCharge,
  chargeAutomatic,
  getChargeUserID,
  getAllChargeUserID,
  createPay,
  createTypeCharge,
  updateChargeType,
  getTypeCharge,
  getCharges,
  deleteChargeType,
  countChargeAssigned,
};
