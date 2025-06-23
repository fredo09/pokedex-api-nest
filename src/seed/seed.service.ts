import axios, { AxiosInstance } from 'axios'
import { Injectable } from '@nestjs/common';
import { PokeAPIResponseI } from './interface';

@Injectable()
export class SeedService {

  //! Forma provisional para realizar peticiones HTTP usando axios
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeAPIResponseI>('https://pokeapi.co/api/v2/pokemon?limit=151');

    return data?.results;
  }
}
