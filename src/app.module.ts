import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { appConfigEnviroment } from './config/app.config';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { PokemonModule } from './pokemon/pokemon.module';

import { joiValidationSchema } from './config/joi.schema.validation';

@Module({
  imports: [
    //! Confirgurar dependencia "config" PARA PODER LEER VARIABLES DE ENTORNO
    //! https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      load: [appConfigEnviroment], //* Cargar la configuracion del archivo app.config.ts "Environment"
      validationSchema: joiValidationSchema, //* Validar las variables de entorno con Joi
    }),
    
    //! Agregar contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'public')
    }),

    //! Importar el modulo de mongoose
    MongooseModule.forRoot(process.env.MONGODB_URL || ''),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {}
