import { Sequelize } from 'sequelize';

// Support Railway's individual variables or a single DATABASE_URL / MYSQL_URL
const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Connection via URL string
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
      connectTimeout: 60000
    }
  });
} else {
  // Fallback to individual variables, checking for Railway's default naming if ours aren't present
  sequelize = new Sequelize(
    process.env.DB_NAME || process.env.MYSQLDATABASE || 'team_task_manager',
    process.env.DB_USER || process.env.MYSQLUSER || 'root',
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || null,
    {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 60000
      }
    }
  );
}

export default sequelize;
