import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CategoryEntity } from './category.entity';

@Schema({ collection: 'Productos', timestamps: true })
export class ProductEntity extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  stock: number;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CategoryEntity.name, required: true })
  categoria: CategoryEntity;
  
  @Prop({ required: true, default: 'activo' })
  estado: string;

  @Prop({ min: 0, max: 100 })
  descuento?: number;

}

export const ProductSchema = SchemaFactory.createForClass(ProductEntity);