import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ProductEntity } from './producto.entity';

@Schema({ timestamps: true, collection: 'Ventas' })
export class Ventas extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ProductEntity.name, required: true })
    productoId: ProductEntity;

    @Prop({ required: true })
    cantidad: number;

    @Prop({ required: true })
    precioUnitario: number;
}

export const VentasSchema = SchemaFactory.createForClass(Ventas);
