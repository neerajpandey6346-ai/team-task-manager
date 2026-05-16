import 'dotenv/config.js';
import sequelize from './config/database.js';
import { User, Project } from './models/index.js';

async function testCreateProject() {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { role: 'admin' } });
    if (!user) {
      console.log('No admin user found');
      process.exit(1);
    }
    
    console.log('Found admin:', user.email);

    const project = await Project.create({
      title: 'Test Project ' + Date.now(),
      description: 'Test description',
      createdBy: user.id
    });
    console.log('Project created:', project.id);

    await project.addMember(user.id, { through: { role: 'lead' } });
    console.log('Member added!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating project:', err);
    process.exit(1);
  }
}

testCreateProject();
