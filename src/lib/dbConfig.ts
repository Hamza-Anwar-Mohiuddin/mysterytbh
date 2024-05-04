import mongoose from 'mongoose';
import {DB_NAME} from '@/constants/constants'
import { log } from 'console';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const connectionURI = `${process.env.MONGO_URI}/${DB_NAME}`;
    // Attempt to connect to the database
    // kuch config options dene keliye ye object pass karte hain ke agar karna chahrahe hon
    const db = await mongoose.connect(connectionURI || '');

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;