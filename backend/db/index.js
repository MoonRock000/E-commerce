import mongoose from 'mongoose';

export const connectDb = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Database connection established successfully.'))
    .catch((err) => console.log(err));
};
