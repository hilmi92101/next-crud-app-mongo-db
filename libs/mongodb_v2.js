import mongoose from 'mongoose';

const connection = {};

const connectMongoDB = async () => {

    console.log('mongoose.connections.length: ' + mongoose.connections.length);

    if (connection.isConnected) {
        return;
    }
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            return;
        }
        await mongoose.disconnect();
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
}

const disconnectMongoDB = async () => {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            await mongoose.disconnect();
            connection.isConnected = false;
        }
    }
}
const db = { connectMongoDB, disconnectMongoDB };

export default db;