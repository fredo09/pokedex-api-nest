import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

 //! decorador para definir un esquema de Mongoose
@Schema()
export class Pokemon extends Document {
	 //! decorador para definir una propiedad del esquema
	@Prop({ unique: true, index: true })
	name: string;

	@Prop({ unique: true, index: true })
	pokemon_number: number;
}

 //! crea un esquema de Mongoose a partir de la clase Pokemon
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
