import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CategoryEntity } from './category.entity';

@Schema({ collection: 'Productos', timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true, default: 'activo' })
  estado: string;

  @Prop({ min: 0, max: 100 })
  descuento?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CategoryEntity.name, required: true })
  categoria: CategoryEntity;
}

export const ProductSchema = SchemaFactory.createForClass(Product);