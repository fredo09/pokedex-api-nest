import axios, { AxiosInstance } from 'axios'
import { Injectable } from '@nestjs/common';
import { PokeAPIResponseI } from './interface';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class SeedService {
  //! Forma provisional para realizar peticiones HTTP usando axios
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeAPIResponseI>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const dataTransformed = data?.results.map(({name, url}) => {
      const pokemonId: number = +url.split('/').slice(-2, -1)[0];
      return {
        pokemon_number: pokemonId,
        name
      }
    });

    // * Insertamos los pokemons en la base de datos */
    await this.pokemonService.create(dataTransformed);

    return `Se han insertado ${dataTransformed.length} pokemons`;
  }
}
