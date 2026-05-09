import 'module-alias/register';
import http from 'http';
import app from './src/app';
import dbConnection from './src/config/db';
import { config } from './src/config/env';
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const main = async () => {
  try {
    await dbConnection();

    server.listen(PORT, () => {
      console.log(`Server is running at ${config.SERVER_URI}`);
    });
  } catch (error) {
    console.error('Failed to start the server due to a DB connection error', error);
    process.exit(1);
  }
};

main();
