
import mongoose, { Mongoose } from "mongoose";

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const globalWithMongoose = global as typeof global & {
  mongoose?: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose.mongoose;

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    console.log(process.env.MONGODB_URI);
    
    cached.promise = mongoose.connect(process.env.URI || "")
    .then((mongoose)=>{console.log("Database connected successfully");
      return mongoose})
    .catch((error)=>{ console.log("There is some error while connecting to DB ",error);
     return error})
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function getClient() {
  const conn = await connectDB();
  return conn.connection.getClient().db(process.env.DB_NAME);
}















// type connectionObject = {
//     isConnected?:number    
// }

// const connection: connectionObject = {};

// async function dbConnect():Promise<void>{
//     if(connection.isConnected){
//         console.log("Database already connected");
        
//         return;
//     }
//     try {
//         console.log(process.env.MONGODB_URI);
        
//         const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

//         connection.isConnected = db.connections[0].readyState;
//         console.log("Data base connected");
        
//     } catch (error) {
//         console.log("DB connection failed! ", error);
//         process.exit(1);
//     }
// }

// dbConnect();
// export default dbConnect;