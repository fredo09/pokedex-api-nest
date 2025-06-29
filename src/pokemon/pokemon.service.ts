import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
  Query} from '@nestjs/common';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    //! Nos permite inyectar el modelo de Mongoose para la entidad Pokemon, ya que la "entity" no es un provider 
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> 
  ) {}

  /**
   * @description - Crea un nuevo pokemon en la base de datos
   * @param createPokemonDto - Objeto que contiene los datos del pokemon a crear
   * @throws {BadRequestException} - Si el pokemon ya existe en la base de datos
   * @throws {InternalServerErrorException} - Si ocurre un error al crear el pokemon
   * @returns {Object} - Retorna un objeto con el estado y mensaje de la creacion del pokemon
   */
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

  /**
   * @description - Busca todos los pokemons en la base de datos
   * @returns {Object} - Retorna un mensaje indicando que se han encontrado todos los pokemons
   * @throws {InternalServerErrorException} - Si ocurre un error al buscar los pok
   */
  async findAll( { limit = 10, offset= 0 }: PaginationDto  ) {
    const allPokemon = await this.pokemonModel
      .find().limit(limit).skip(offset)
      .sort({ pokemon_number: 1 }).select('-__v');

    // return {
    //   status: 'success',
    //   message: 'All pokemons found successfully',
    //   pokemons: allPokemon,
    //   total: allPokemon.length,
    // };
    return allPokemon;
  }

  /**
   * @description - Busca un pokemon en la base de datos por su numero, id o nombre
   * @param term {String} - Puede ser un numero, un id de mongo o el nombre del pokemon
   * @returns {Object} - Retorna un pokemon encontrado en la base de datos
   * @throws {NotFoundException} - Si no se encuentra el pokemon en la base
   */
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

  /**
   * @description - Actualiza un pokemon en la base de datos por su numero, id o nombre
   * @param term {String} - Puede ser un numero, un id de mongo o el nombre del pokemon
   * @param updatePokemonDto {UpdatePokemonDto} - Objeto con los datos a actualizar del pokemon
   * @returns {Object} - Retorna el pokemon actualizado
   * @throws {NotFoundException} - Si no se encuentra el pokemon en la base
   * @throws {BadRequestException} - Si el nombre del pokemon ya existe en la base de datos
   * @throws {InternalServerErrorException} - Si ocurre un error al actualizar el pokemon
   */
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

  /**
   * @description - Elimina un pokemon de la base de datos por su id
   * @param id {string} - Id del pokemon a eliminar
   * @returns {Object} - Retorna un objeto con el estado y mensaje de la eliminacion
   * @throws {BadRequestException} - Si no se encuentra el pokemon en la base
   */
  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} not found`);

    return {
      status: 'success',
      message: `Pokemon with id ${id} deleted successfully`,
    };
  }

  /**
   * @description - Maneja las excepciones personalizadas de la base de datos
   * @param error {any} - Error thrown by the database
   * @throws {BadRequestException} - Si el pokemon ya existe en la base de datos
   * @throws {InternalServerErrorException} - Si ocurre un error al crear el pokemon
   * @private
   */
  private _handleCustomExceptions(error: any) {
    if ( error.code === 11000) {
      throw new BadRequestException(`pokemon in db already exists ${JSON.stringify(error.keyValue)}`);
    }
  
    console.warn("🚀 ~ error:", error);
    throw new InternalServerErrorException(`Cant create pokemon - Check server logs`);
  }
}
