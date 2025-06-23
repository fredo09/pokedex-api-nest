import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([ //* Importa el esquema de Mongoose para la entidad Pokemon
      { name: Pokemon.name, schema: PokemonSchema }
    ])
  ],
  exports: [PokemonService] // Exporta el servicio para que pueda ser utilizado en otros módulos
})
export class PokemonModule {}
