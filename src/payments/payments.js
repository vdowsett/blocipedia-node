const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

var stripe = require("stripe")(keySecret);

module.exports = {

    service: stripe,

    charges: {
        premium( user = {}, token = "" ) {
            return {
              amount: 1499,
              currency: "usd",
              source: token,
              description: `Blocipedia Premium Plan fee for ${ user.username }`,
              metadata: { userId: user.id },
              receipt_email: user.email,
              statement_descriptor: "Blocipedia Premium",
            };
          },
    }


    
}
