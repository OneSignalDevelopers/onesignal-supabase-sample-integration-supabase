export const generatePushMessage = (amount: number, currency: string) =>
  `You just spent ${amount / 100} ${(currency as String).toUpperCase()}.`

export const generateEmailMessage = (amount: number, currency: string) =>
  `<html><body>You just spent ${amount / 100} ${(
    currency as String
  ).toUpperCase()}. <a href="#">Unsubscribe</a></body></html>`
