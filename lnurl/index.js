const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const lnurl = require('lnurl-pay');
const {parsePaymentRequest} = require('invoices');
///import { isValidPreimage, requestInvoice } from 'lnurl-pay'

console.log(lnurl);

const RECIPIENT = 'bumi@getalby.com';
const AMOUNT = 25;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render("index");
})

app.post("/invoice", async function (req, res) {
  const { invoice, params, successAction, validatePreimage } = await lnurl.requestInvoice({
    lnUrlOrAddress: RECIPIENT,
    tokens: AMOUNT,
  });
  const requestDetails = parsePaymentRequest({request: invoice });
  res.json({ payment_request: invoice, payment_hash: requestDetails.id });
});

const port = process.env.PORT || 3030;
console.log(`Running on ${port}`);
app.listen(port);
