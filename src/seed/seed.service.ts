import axios, { AxiosInstance } from 'axios'
import { Injectable } from '@nestjs/common';
import { PokeAPIResponseI } from './interface';

@Injectable()
export class SeedService {
  //! Forma provisional para realizar peticiones HTTP usando axios
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeAPIResponseI>('https://pokeapi.co/api/v2/pokemon?limit=1');

    data?.results.forEach(({name, url}) => {
      const pokemonId: number = +url.split('/').slice(-2, -1)[0];
      console.log("🚀 ~ SeedService ~ data?.results.forEach ~ pokemonId:", {
        name,
        numero_pokemon: pokemonId,
      })
    })

    return data?.results;
  }
}
