import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Categorias', timestamps: true })
export class CategoryEntity extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryEntity);