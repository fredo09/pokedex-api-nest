import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule, // -> Podemos importar el ConfigModule para poder usar el ConfigService "enviroment" 
    MongooseModule.forFeature([ //* Importa el esquema de Mongoose para la entidad Pokemon
      { name: Pokemon.name, schema: PokemonSchema }
    ])
  ],
  exports: [MongooseModule] // Exporta el servicio para que pueda ser utilizado en otros módulos
})
export class PokemonModule {}
