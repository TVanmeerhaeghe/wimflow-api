const cron = require("node-cron");
const Maintenance = require("./models/Maintenance/Maintenance");
const Site = require("./models/Site");
const sendReminderEmail = require("./mailer");
const { Op } = require("sequelize");
const sequelize = require('./config/db');

cron.schedule("0 9 * * *", async () => {
  console.log("Vérification des maintenances à 9h chaque jour...");

  const today = new Date().toISOString().slice(0, 10);

  try {
    const maintenances = await Maintenance.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("next_maintenance")),
            today
          ),
          { active: true }
        ]
      },
      include: [Site],
    });

    maintenances.forEach((maintenance) => {
      const { name, email_maintenance } = maintenance.Site;
      sendReminderEmail(email_maintenance, name);
    });

    console.log(`Vérification terminée. ${maintenances.length} maintenances trouvées.`);
  } catch (error) {
    console.error("Erreur lors de la vérification des maintenances : ", error);
  }
});
