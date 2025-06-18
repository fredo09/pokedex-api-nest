import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

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
    const pokemon = await this.pokemonModel.create(createPokemonDto);

    return {
      status: 'success',
      message: 'Pokemon created successfully',
      pokemon,
    };
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
