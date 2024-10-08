import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
