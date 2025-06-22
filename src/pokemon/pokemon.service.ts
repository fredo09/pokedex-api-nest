import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException } from '@nestjs/common';

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
      if ( error.code === 11000) {
        throw new BadRequestException(`pokemon in db already exists ${JSON.stringify(error.keyValue)}`);
      }
      console.warn("🚀 ~ error:", error);
      throw new InternalServerErrorException(`Cant create pokemon - Check server logs`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
