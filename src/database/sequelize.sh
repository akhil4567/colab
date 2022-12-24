npx sequelize-cli migration:generate --name create-user
npx sequelize-cli migration:generate --name create-role
npx sequelize-cli migration:generate --name create-tenant
npx sequelize-cli migration:generate --name create-department
npx sequelize-cli migration:generate --name create-location
npx sequelize-cli migration:generate --name create-location-department-mapping
npx sequelize-cli migration:generate --name create-customer
npx sequelize-cli migration:generate --name create-plan
npx sequelize-cli migration:generate --name create-feature
npx sequelize-cli migration:generate --name create-plan-feature-mapping
npx sequelize-cli migration:generate --name create-permission
npx sequelize-cli migration:generate --name create-role-permission-mapping
npx sequelize-cli migration:generate --name add-tenantId-column-role
npx sequelize-cli migration:generate --name create-user-mapping
npx sequelize-cli migration:generate --name add-planId-column-tenant
npx sequelize-cli migration:generate --name create-staffEngagement
npx sequelize-cli migration:generate --name create-staffEngagementException
npx sequelize-cli migration:generate --name create-staffEngagementUserMapping
npx sequelize-cli migration:generate --name add-tenantId-column-customer
npx sequelize-cli migration:generate --name alter-user
npx sequelize-cli migration:generate --name add-address-columns-tenant
npx sequelize-cli migration:generate --name alter-staffEngagementException
npx sequelize-cli migration:generate --name alter-slotException
npx sequelize-cli migration:generate --name create-engagement
npx sequelize-cli migration:generate --name alter-customer
npx sequelize-cli migration:generate --name alter-staffEngagement
npx sequelize-cli migration:generate --name add-tenantId-uniqueconstraints-customer
npx sequelize-cli migration:generate --name add-flag-column-customer
npx sequelize-cli migration:generate --name create-email-template
npx sequelize-cli migration:generate --name create-sms-template
npx sequelize-cli migration:generate --name add-accountId-reason-customer
npx sequelize-cli migration:generate --name create-user-profile
npx sequelize-cli migration:generate --name add-profileid-coloumn-user-mapping
npx sequelize-cli migration:generate --name add-profileId-unique-constraints-user-mappings
npx sequelize-cli migration:generate --name add-communicationNumberId-column-tenant
npx sequelize-cli migration:generate --name add-coloumn-meetingType-slot
npx sequelize-cli migration:generate --name add-video-coloumns-engagement
npx sequelize-cli migration:generate --name add-coloumn-status-usermappings
npm run generate_migration create-tenantConfiguration
npx sequelize-cli migration:generate --name create-notifications
npx sequelize-cli migration:generate --name create-chatRoom
npx sequelize-cli migration:generate --name create-chatUserMapping
npx sequelize-cli migration:generate --name create-message        
<<<<<<< HEAD

npm run generate_migration add-customerProfileImage-col-Customer 
npm run generate_migration add-groupProfileImage-col-Customer 
=======
npx sequelize-cli migration:generate --name create-UserConnections
>>>>>>> origin/development
