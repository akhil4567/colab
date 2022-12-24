module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkDelete("SlotExceptions", null, { transaction: t }),
        queryInterface.addColumn("SlotExceptions", "slotDuration",
          {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          { transaction: t }
        ),
        queryInterface.addColumn("SlotExceptions", "assignedTo",
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'Users',
              key: 'id'
            }
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("SlotExceptions", "slotDuration", {
          transaction: t,
        }),
        queryInterface.removeColumn("SlotExceptions", "assignedTo", {
          transaction: t,
        })
      ]);
    });
  },
};
