module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn("Customers", "flag", {
                    type: Sequelize.STRING,
                    allowNull: true
                }, { transaction: t }),
            ]);
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("Customers", "flag", {
                    transaction: t
                })
            ]);
        });
    },
};