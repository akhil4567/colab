'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('PlanFeatureMappings', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            planId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Plans',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
            },
            featureId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Features',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
              allowNull: true,
              type: Sequelize.DATE
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('PlanFeatureMappings');
    }
};