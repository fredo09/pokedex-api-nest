import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    //! Agregar contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'public')
    })
  ],
})
export class AppModule {}
