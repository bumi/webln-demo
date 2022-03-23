function pay() {
  fetch("/invoice", {
    method: "POST",
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      document.getElementById("payment-request").innerHTML =
        data.payment_request;
      document.getElementById("payment-hash").innerHTML = data.payment_hash;

      if (window.webln) {
        await webln.enable();

        const payResponse = await webln.sendPayment(data.payment_request);

        document.getElementById("preimage").innerHTML = payResponse.preimage;

        sha256(payResponse.preimage).then((hash) => {
          if (hash === data.payment_hash) {
            document.getElementById("success").append("yay, paid -- ");
          } else {
            alert("fail");
          }
        });
      } else {
        alert("NO webln enabled");
      }
    });
}

function stream() {
  pay();
  window.setInterval(pay, 10000);
}

function sha256(hexString) {
  const match = hexString.match(/.{1,2}/g);
  const msgUint8 = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

  //const msgUint8 = new TextEncoder().encode(message);
  return crypto.subtle.digest("SHA-256", msgUint8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  });
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
