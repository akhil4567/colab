'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RolePermissionMappings', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            roleId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Roles',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
            },
            permissionId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Permissions',
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
        await queryInterface.dropTable('RolePermissionMappings');
    }
};