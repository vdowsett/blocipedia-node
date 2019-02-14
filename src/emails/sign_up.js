const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  signUpEmail(req, res, next) {
      
    const msg = {
        to: newUser.email,
        from: 'vdowsett@gmail.com',
        subject: 'Welcome to Blocipedia',
        text: 'Did you know? Every citizen of Kentucky is required by law to take a bath once a year.',
        html: '<strong>Did you know? </strong> Every citizen of Kentucky is required by law to take a bath once a year.',
    };

    sgMail.send(msg);

    next();
  },

}
