const stripe = require( "stripe" )( process.env.STRIPE_API_SECRET );

(async () => {
  const charge = await stripe.charges.create({
    amount: 999,
    currency: 'usd',
    source: 'tok_visa',
    receipt_email: 'jenny.rosen@example.com',
  });
})();