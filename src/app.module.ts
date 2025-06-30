import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    //! Agregar contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'public')
    }),

    //! Confirgurar dependencia "config" PARA PODER LEER VARIABLES DE ENTORNO
    //! https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot(),

    //! Importar el modulo de mongoose
    MongooseModule.forRoot(process.env.MONGODB_URL || ''),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {
  constructor() {
    console.log("🚀 ~ contructor:", process.env);
  }
}
