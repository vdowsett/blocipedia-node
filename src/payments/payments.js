const stripe = require( "stripe" )( process.env.STRIPE_API_SECRET );

module.exports = {

  premiumPayment(req, res, next) {
    if(req.params.plan === "premium") {

      stripe.charges.create({
        amount: 15,
        currency: "usd",
        source: "tok_mastercard", // obtained with Stripe.js
        description: "Charge for Blocipeia Premium"
      }, function(err, charge) {
        // asynchronously called
      });

    } else {

      return;

    }
    
  },

}
