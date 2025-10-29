// src/models/Product.ts
import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inventory: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const Product = models.Product || model('Product', productSchema);
export default Product;