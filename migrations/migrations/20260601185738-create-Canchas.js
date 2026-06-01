'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Canchas', {
      idCancha: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombreCancha: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true
      },
      deporte: {
        type: Sequelize.STRING(50),
        defaultValue: 'Futbol'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      precioHora: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      Estado: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      fechC: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechM: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Canchas');
  }
};
