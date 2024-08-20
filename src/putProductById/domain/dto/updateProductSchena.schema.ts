import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductoDocument = Producto & Document;

@Schema()
export class Producto {
    @Prop({ required: true })
    nombre: string;

    @Prop()
    descripcion?: string;

    @Prop({ required: true })
    precio: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ min: 0, max: 100 })
    descuento?: number;

    @Prop({ required: true })
    categoria: string;


}

export const ProductoSchema = SchemaFactory.createForClass(Producto);
