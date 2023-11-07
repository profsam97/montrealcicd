import mongoose from "mongoose";

const connect = mongoose;

connect.connect(process.env.Mongo_URL as string)

export default connect;