const path = require("path");
const express = require("express");
const lnService = require("ln-service");
const cookieParser = require("cookie-parser");

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

app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const invoice = await lnService.createInvoice({
    lnd,
    tokens: 10,
    description: "bolt.fun rocks",
  });

  console.log(invoice);
  res.cookie("_ln_id", invoice.id);
  res.render("index", { invoice });
});

app.get("/authenticated", async (req, res) => {
  console.log(req.cookies);
  const id = req.cookies._ln_id;
  console.log(id);
  const invoice = await lnService.getInvoice({
    lnd,
    id,
  });

  if (invoice.is_confirmed) {
    res.render("success");
  } else {
    res.redirect("/");
  }
});

const port = process.env.PORT || 3030;
console.log(`Running on ${port}`);
app.listen(port);
