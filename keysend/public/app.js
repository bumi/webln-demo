function fetchMessages() {
  fetch("/messages")
    .then((res) => res.json())
    .then((messages) => {
      // never ever do that! who hacks me?
      document.getElementById("messages").innerHTML =
        messages.join("<br /><br />");
    });
}

fetchMessages();
document
  .getElementById("message-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("message");
    const message = input.value;

    // request permission
    await webln.enable();
    // initiate keysend
    await webln.keysend({
      destination: window.DESTINATION,
      amount: "1",
      customRecords: { 34349334: message },
    });

    // refresh the messages
    fetchMessages();
    input.value = "";
  });
