'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PaymentEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentID: {
        type: Sequelize.STRING
      },
      ticketNo: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.STRING
      },
      organizer: {
        type: Sequelize.STRING
      },
      event: {
        type: Sequelize.STRING
      },
      transactionID: {
        type: Sequelize.STRING
      },
      attendanceStatus: {
        type: Sequelize.STRING
      },
      customer: {
        type: Sequelize.JSON
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      refID: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PaymentEvents');
  }
};