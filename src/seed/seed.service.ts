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
    const { data } = await this.axios.get<PokeAPIResponseI>('https://pokeapi.co/api/v2/pokemon?limit=10');

    data?.results.forEach( async({name, url}) => {
      const pokemonId: number = +url.split('/').slice(-2, -1)[0];

      const result = await this.pokemonModel.create({
        name: name.toLowerCase(),
        pokemon_number: pokemonId,
      });
    });

    // * Insertamos los pokemons en la base de datos */
    // await this.pokemonService.create(dataTransformed);
    return `Se ha realizado el seed de los pokemons`;
  }
}
