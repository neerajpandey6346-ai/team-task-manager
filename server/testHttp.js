import 'dotenv/config.js';
import jwt from 'jsonwebtoken';
import { User } from './models/index.js';

async function testHttp() {
  try {
    const user = await User.findOne({ where: { role: 'admin' } });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const res = await fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        title: 'Project from HTTP',
        description: 'Testing'
      })
    });

    console.log(res.status);
    console.log(await res.text());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
testHttp();
