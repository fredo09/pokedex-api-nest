import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePokemonDto {
	@IsString()
	@MinLength(1)
	name: string;

	@IsInt()
	@IsPositive()
	pokemon_number: number;
}
