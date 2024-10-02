const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendReminderEmail = async (to, siteName) => {
  const msg = {
    to,
    from: process.env.EMAIL_USER,
    subject: `Maintenance à faire pour le site ${siteName}`,
    text: `La maintenance du site ${siteName} est due aujourd'hui. Veuillez la réaliser au plus vite.`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email envoyé à ${to} pour le site ${siteName}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${to} :`, error);
  }
};

module.exports = sendReminderEmail;
