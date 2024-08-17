import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from './producto.entity';

@Schema({ timestamps: true })
export class Sale extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name, required: true })
    productoId: Product;

    @Prop({ required: true })
    cantidad: number;

    @Prop({ required: true })
    precioUnitario: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
