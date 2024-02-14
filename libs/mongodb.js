import mongoose from "mongoose";

const connectMongoDB = async () => {

    console.log(mongoose.connections.length)
    return false;
    
    try {
        //await mongoose.connect(process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.log(error);
    }
};

export default connectMongoDB;