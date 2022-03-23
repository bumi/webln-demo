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
  process.env.KEYSEND_DESTINATION = result.public_key;
});

const app = express();
const port = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (req, res) {
  res.render("index", {
    url: `${req.protocol}://${req.hostname}`,
    price: process.env.KEYSEND_PRICE || 1,
    destination: process.env.KEYSEND_DESTINATION,
  });
});

app.get("/messages", (req, res) => {
  lnService.getInvoices({ lnd }, async (err, result) => {
    const keysends = [];
    const invoices = result.invoices;
    invoices.forEach((i) => {
      const payment = i.payments[0];
      if (!payment) {
        return;
      }
      const messages = payment.messages;
      const keysend = messages.forEach((m) => {
        if (m["type"] === "34349334") {
          keysends.push(Buffer.from(m["value"], "hex").toString());
        }
      });
    });
    res.send(keysends);
  });
});

console.log(`Running on ${port}`);
app.listen(port);
