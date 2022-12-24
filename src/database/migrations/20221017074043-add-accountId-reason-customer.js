module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([

                queryInterface.addColumn("Customers", "reason", {
                    type: Sequelize.STRING,
                    allowNull: true
                }, { transaction: t }),

                queryInterface.addColumn("Customers", "accountId", {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    autoIncrement: true,

                }, { transaction: t }),

            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("Customers", "reason", {
                    transaction: t
                }),
                queryInterface.removeColumn("Customers", "accountId", {
                    transaction: t
                })
            ]);
        });
    },
};