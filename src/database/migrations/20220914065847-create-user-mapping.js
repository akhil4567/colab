'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserMappings', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            userId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Users',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
            },
            tenantId: {
                type: Sequelize.UUID,
                references: {
                    model: {
                        tableName: 'Tenants',
                        schema: 'public'
                    },
                    key: 'id'
                },
                allowNull: false
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
              allowNull: true
            },
            departmentId: {
              type: Sequelize.UUID,
              references: {
                  model: {
                      tableName: 'Departments',
                      schema: 'public'
                  },
                  key: 'id'
              },
              allowNull: true
            },
            locationId: {
              type: Sequelize.UUID,
              references: {
                  model: {
                      tableName: 'Locations',
                      schema: 'public'
                  },
                  key: 'id'
              },
              allowNull: true
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
        await queryInterface.dropTable('UserMappings');
    }
};