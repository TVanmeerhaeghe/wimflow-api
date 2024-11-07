const Client = require("../models/Client");
const Site = require("../models/Site");

const createClient = async (req, res) => {
  const {
    first_name,
    last_name,
    company,
    address,
    city,
    postal_code,
    site_id,
    phone,
    email,
    client_type,
    registration_date,
    status,
  } = req.body;

  try {
    const client = await Client.create({
      first_name,
      last_name,
      company,
      address,
      city,
      postal_code,
      phone,
      email,
      client_type,
      registration_date,
      status,
    });

    if (site_id) {
      await Site.update(
        { client_id: client.id },
        { where: { id: site_id } }
      );
    }

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: Site,
          attributes: ["url", "name"],
        },
      ],
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching clients", error });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving client", error });
  }
};

const updateClient = async (req, res) => {
  const {
    first_name,
    last_name,
    company,
    address,
    city,
    postal_code,
    site_id,
    phone,
    email,
    client_type,
    status,
  } = req.body;

  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.update({
      first_name,
      last_name,
      company,
      address,
      city,
      postal_code,
      site_id,
      phone,
      email,
      client_type,
      status,
    });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.destroy();
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
