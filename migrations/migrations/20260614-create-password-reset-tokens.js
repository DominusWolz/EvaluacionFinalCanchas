'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('password_reset_tokens', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      token_hash: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('password_reset_tokens', ['user_id'], { name: 'idx_password_reset_tokens_user_id' });
    await queryInterface.addIndex('password_reset_tokens', ['token_hash'], { name: 'idx_password_reset_tokens_token_hash' });
    await queryInterface.addIndex('password_reset_tokens', ['expires_at'], { name: 'idx_password_reset_tokens_expires_at' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('password_reset_tokens');
  }
};