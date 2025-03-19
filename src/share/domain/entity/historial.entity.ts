import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductEntity } from './producto.entity';

@Schema()
export class SaleEntity extends Document {
    @Prop({ type: Types.ObjectId, ref: ProductEntity.name })
    producto: ProductEntity;

    @Prop()
    quantity: number;

    @Prop({ default: Date.now })
    fechaVenta: Date;
}

export const HistorialSchema = SchemaFactory.createForClass(SaleEntity);
