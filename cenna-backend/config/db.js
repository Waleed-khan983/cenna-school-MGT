import mongoose from 'mongoose';

const connectDB = async () => {
  try{
    // autoIndex only ever ADDS indexes missing from a collection — it never
    // drops one that's deployed but no longer in the schema, which is
    // exactly how the Attendance index drift happened undetected (see Tier
    // 6A report). Left on in development for convenience; off in
    // production so index changes always go through an explicit, reviewed
    // migration instead of an implicit background build on every boot.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: process.env.NODE_ENV !== "production",
    });
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  }catch(err){
    console.log(`Connection Failed due to `,err)
    process.exit(1);
  }
};

export default connectDB;
