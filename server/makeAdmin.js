import 'dotenv/config.js';
import sequelize from './config/database.js';

async function makeAllAdmins() {
  try {
    await sequelize.authenticate();
    await sequelize.query("UPDATE Users SET role='admin'");
    console.log('Successfully upgraded all existing users to admin!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

makeAllAdmins();
