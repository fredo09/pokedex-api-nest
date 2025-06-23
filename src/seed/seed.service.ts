//! este import de la otra forma import { PokemonService } from '../pokemon/pokemon.service';
import axios, { AxiosInstance } from 'axios'
import { Injectable } from '@nestjs/common';
import { PokeAPIResponseI } from './interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  //! Forma provisional para realizar peticiones HTTP usando axios
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> 
  ) {}

  async executeSeed() {
    //! Constante para insertar los pokemons en la base de datos forma uno
    // const arrayPromiseInsertPokemon: Promise<any>[] = [];

    const pokemonsToinsert: { name: string; pokemon_number: number }[] = [];

    //* Tendremos que eliminar los pokemons existentes en la base de datos
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeAPIResponseI>('https://pokeapi.co/api/v2/pokemon?limit=650');

    data?.results.forEach( async({name, url}) => {
      const pokemonId: number = +url.split('/').slice(-2, -1)[0];

      //! Forma alternativa de realizar la insercion de los pokemons en la base de datos
      // const result = await this.pokemonModel.create({
      //   name: name.toLowerCase(),
      //   pokemon_number: pokemonId,
      // });

      //* Forma uno de hacer la insercion de los pokemons en la base de datos
      // arrayPromiseInsertPokemon.push(
      //   this.pokemonModel.create({
      // name: name.toLowerCase(),
      // pokemon_number: pokemonId,
      //   })
      // );

      //! Forma dos de hacer la insercion de los pokemons en la base de datos
      pokemonsToinsert.push({ name: name.toLowerCase(), pokemon_number: pokemonId })
    });

    //! forma de hacer una insercion masiva de los pokemons
    // await Promise.all(arrayPromiseInsertPokemon);

    //! Forma dos de hacer una insercion masiva de los pokemons "Recomendado"
    await this.pokemonModel.insertMany(pokemonsToinsert);

    // * Insertamos los pokemons en la base de datos */
    // await this.pokemonService.create(dataTransformed);
    return `Se ha realizado el seed de los pokemons`;
  }
}
