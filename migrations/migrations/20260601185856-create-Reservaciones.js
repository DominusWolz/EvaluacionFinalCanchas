'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservaciones', {
      idReserva: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'idUsuario'
        },
        onDelete: 'CASCADE'
      },
      idCancha: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Canchas',
          key: 'idCancha'
        },
        onDelete: 'CASCADE'
      },
      inicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('reservada','cancelada','completada'),
        defaultValue: 'reservada'
      },
      precio_total: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0.00
      },
      fechCreacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechModificacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reservaciones');
  }
};
