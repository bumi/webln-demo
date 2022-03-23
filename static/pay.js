async function pay() {
  const comment = document.getElementById("message").value;
  const { invoice, params, successAction, validatePreimage } =
    await LnurlPay.requestInvoice({
      lnUrlOrAddress: "ben@lnurl.com",
      tokens: 10,
      comment: comment,
    });

  if (window.webln) {
    await webln.enable();

    const payResponse = await webln.sendPayment(invoice);

    document.getElementById("preimage").innerHTML = payResponse.preimage;

    if (validatePreimage(payResponse.preimage)) {
      document.getElementById("success").append("yay, paid -- ");
    } else {
      alert("fail");
    }
  } else {
    alert("NO webln enabled");
  }
}

function stream() {
  pay();
  window.setInterval(pay, 10000); // TODO: make this smarter. e.g. with some debouncing
}

document.getElementById("unlock-button").addEventListener("click", (event) => {
  event.preventDefault();
  event.target.innerHTML = "loading...";
  pay();
});

document.getElementById("stream-button").addEventListener("click", (event) => {
  event.preventDefault();
  event.target.innerHTML = "streaming...";
  stream();
});
