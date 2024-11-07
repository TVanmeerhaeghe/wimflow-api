const CompanyInfo = require("../models/CompanyInfo");

const getCompanyInfo = async (req, res) => {
  try {
    const companyInfo = await CompanyInfo.findOne();
    if (!companyInfo) {
      return res.status(404).json({ message: "Informations introuvables" });
    }
    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des informations", error });
  }
};

const updateCompanyInfo = async (req, res) => {
  const {
    name,
    address,
    city,
    postal_code,
    country_code,
    phone,
    vat_number,
    payment_info,
    general_sales_conditions,
  } = req.body;

  try {
    const companyInfo = await CompanyInfo.findOne();
    if (companyInfo) {
      await companyInfo.update({
        name,
        address,
        city,
        postal_code,
        country_code,
        phone,
        vat_number,
        payment_info,
        general_sales_conditions,
      });
      res.json({ message: "Informations mises à jour avec succès", companyInfo });
    } else {
      const newCompanyInfo = await CompanyInfo.create(req.body);
      res.json({ message: "Informations créées avec succès", newCompanyInfo });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des informations", error });
  }
};

module.exports = {
  getCompanyInfo,
  updateCompanyInfo,
};
