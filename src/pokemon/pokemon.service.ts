import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException} from '@nestjs/common';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    //! Nos permite inyectar el modelo de Mongoose para la entidad Pokemon, ya que la "entity" no es un provider 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> 
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    //* Realizamos un ainsercion a la base de datos en MongoDB
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return {
        status: 'success',
        message: 'Pokemon created successfully',
        pokemon,
      };
    } catch (error) {
      this._handleCustomExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ pokemon_number: term })
    }

    //* MONGO-ID y si no esxiste el pokemon encontrado buscamos por el term -> que es un id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //* Name pokmeon
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) 
      throw new NotFoundException(`Pokemon with ${term} not found`); 

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {
      this._handleCustomExceptions(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private _handleCustomExceptions(error: any) {
    if ( error.code === 11000) {
      throw new BadRequestException(`pokemon in db already exists ${JSON.stringify(error.keyValue)}`);
    }
  
    console.warn("🚀 ~ error:", error);
    throw new InternalServerErrorException(`Cant create pokemon - Check server logs`);
  }
}
