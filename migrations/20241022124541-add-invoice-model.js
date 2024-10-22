'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      creation_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      validity_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      margin_ht: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      total_ht: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_tva: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      object: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Brouillon", "Envoyé", "Payé", "Annulé"),
        defaultValue: "Brouillon",
      },
      admin_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clients',
          key: 'id'
        },
        allowNull: false,
      },
      commercial_contact_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: false,
      },
      advance_payment: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      final_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.createTable('InvoiceTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price_per_day: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tva: {
        type: Sequelize.DECIMAL(4, 2),
        defaultValue: 20.00,
      },
      invoice_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Invoices',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('InvoiceTasks');
    await queryInterface.dropTable('Invoices');
  }
};
