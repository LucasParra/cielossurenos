const Koa = require("koa");
const koaRouter = require("koa-router");
const { SUPABASE_KEY } = require("./config");
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://dmozfnxzbakyxnlzgqkm.supabase.co";
const supabase = createClient(supabaseUrl, SUPABASE_KEY);
// const moment = require("moment");

const app = new Koa();
const router = new koaRouter();

router.get("/invoice/:userID", (ctx) => {
  const { userID } = ctx.params;
  supabase
    .from("UserAddress")
    .select("User(*),Address(*)")
    .eq("UserID", userID)
    .then(({ data }) => {
      supabase
        .from("UserProduct")
        .select("Product(*),Price")
        .eq("UserID", userID)
        .then(({ data: products }) => {
          const { Rut } = data[0].User;
          const { AddressName, AddressNumber } = data[0].Address;
          ctx.response.status = 200;
          ctx.body = {
            status: "success",
            data: {
              // "codeSii": 33, ----------este--------
              // "officeId": 1,----------este--------
              emissionDate: 1462527931,
              client: {
                code: Rut,
                // "company": "DEMO API BSALE SA",----------este--------
                activity: "Giro Informática",
                // "municipality": "Comuna",----------este--------
                // "city": "Puerto Varas",----------este--------
                address: `${AddressName} ${AddressNumber}`,
                // "email": "api@bsale.cl"----------este--------
              },
              details: products.map(({ Price, Product: { Name } }) => ({
                netUnitValue: Price,
                quantity: 1,
                taxes: [
                  {
                    code: 14,
                    percentage: 19,
                  },
                ],
                comment: Name,
              })),
              payments: [
                {
                  paymentTypeId: 1,
                  amount: 25000,
                  recordDate: 1462527931,
                },
              ],
            },
          };
        });
    });
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
