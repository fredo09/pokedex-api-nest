import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    //! Agregar contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'public')
    }),

    //! Importar el modulo de mongoose
    MongooseModule.forRoot('mongodb://localhost:27017/nest-poke-api'),
    PokemonModule,
    CommonModule
  ],
})
export class AppModule {}
