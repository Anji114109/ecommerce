// src/models/Product.ts
import { Schema, model, models, InferSchemaType } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  inventory: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Infer the type from the schema
export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: string; // lean() converts ObjectId to string
};

const Product = models.Product || model('Product', productSchema);
export default Product;