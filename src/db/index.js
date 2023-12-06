import mongoose from "mongoose";
import { dbName } from "../constants.js";

const connectionDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log("Database connected ", connectionInstance.connection.host)
    } catch (error) {
        console.log("Error in connecting to the database ", error);
        process.exit(1);
    }
}

export default connectionDb