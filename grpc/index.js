const path = require("path");
const express = require("express");
const lnService = require("ln-service");

require("dotenv").config();

const { lnd } = lnService.authenticatedLndGrpc({
  cert: process.env.LND_CERT,
  macaroon: process.env.LND_MACAROON,
  socket: process.env.LND_ADDRESS,
});

lnService.getIdentity({ lnd }, (error, result) => {
  console.log(error);
  console.log(result);
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const invoice = await lnService.createInvoice({
    lnd,
    tokens: 100,
    description: "bolt.fun rocks",
  });

  console.log(invoice);
  res.render("index", { invoice });
});

app.post("/invoice", async function (req, res) {
  const { invoice, params, successAction, validatePreimage } =
    await lnurl.requestInvoice({
      lnUrlOrAddress: RECIPIENT,
      tokens: AMOUNT,
    });
  const requestDetails = parsePaymentRequest({ request: invoice });
  res.json({ payment_request: invoice, payment_hash: requestDetails.id });
});

const port = process.env.PORT || 3030;
console.log(`Running on ${port}`);
app.listen(port);
