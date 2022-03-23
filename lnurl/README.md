# webln-demo

This is a quick demo of a WebLN enabled websites. It shows how to programatically request a lightning payment from a visitor through JavaScript.

## Flow

1. website requests an invoice from the server
2. In this example the server uses a lightning address / LNURL to request an invoice
   This has the advantage that the app does not need to know any credentials to the lightning node
3. On the client WebLN JavaScript is used to request the payment from the visitor
4. The visitor confirms the payment in the wallet
5. The preimage is returned to the website JavaScript
6. The website can validate the preimage

## Links

- [webln.dev](https://webln.dev/)
- [Alby browser wallet](https://getalby.com/)
