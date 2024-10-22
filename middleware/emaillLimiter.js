const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes de votre part, veuillez réessayer plus tard."
});

module.exports = { emailLimiter };