import { Sequelize } from 'sequelize';

// Support Railway's individual variables or a single DATABASE_URL / MYSQL_URL
const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  console.log('📡 Database: Connecting via URL string...');
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      connectTimeout: 60000
    }
  });
} else {
  const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
  const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
  const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'team_task_manager';
  
  console.log(`📡 Database: Connecting to ${dbName} at ${host} as ${user}...`);
  
  sequelize = new Sequelize(
    dbName,
    user,
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || null,
    {
      host: host,
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
