import mongoose from "mongoose";

export const dbConnection = async (dbUrl) => {
    await mongoose.connect(dbUrl).then(() => {
        console.log("Connected to MongoDB");
      }).catch((err) => {
        console.log(err);
      });
}
