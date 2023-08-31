import { app } from './app.js';
import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const uriDb = process.env.DB_HOST;

const startAnimation = () => {
  const animation = ['| ', '/ ', '- ', '\\ '];
  let index = 0;

  setInterval(() => {
    process.stdout.write('\r' + animation[index]);
    index = (index + 1) % animation.length;
  }, 80);
};

const runServer = async () => {
  try {
    const connection = await mongoose.connect(uriDb);
    console.log('Database connection successful');
    app.listen(3000, () => {
      console.log('Host: 127.0.0.1:3000/api/contacts/');
      console.log('>>> Press Ctrl+C to stop <<<');
      console.log('Server running.');
    });
  } catch (error) {
    console.log('Cannot connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
};

runServer();
startAnimation();
