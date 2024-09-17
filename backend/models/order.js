import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['processing', , 'shipped', 'canceled', 'delivered'],
      default: 'processing',
    },
    shippingInfo: {
      address: String,
      company: {
        type: String,
        default: 'DHL',
      },
      trackingNumber: String,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
