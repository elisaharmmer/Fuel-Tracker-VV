import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostoController } from './controllers/posto.controller';
import { PostoService } from './services/posto.service';
import { Posto } from './entities/posto.entity';
import {CombustivelController} from "./controllers/combustivel.controller";
import {PrecoController} from "./controllers/preco.controller";
import {CombustivelService} from "./services/combustivel.service";
import {PrecoService} from "./services/preco.service";
import {Combustivel} from "./entities/combustivel.entity";
import {PrecoColetado} from "./entities/preco-coletado.entity";  // Entidade Posto

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'sqlserver', // Host do serviço no docker-compose
      port: 1433,
      username: 'sa',
      password: 'SenhaForte123',
      database: 'CombustiveisDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Certifique-se de que as entidades estão no caminho correto
      synchronize: false,
      options: {
        encrypt: false,
      },
    }),
    TypeOrmModule.forFeature([Posto, Combustivel, PrecoColetado])  // Registra o repositório para a entidade Posto
  ],
  controllers: [AppController, PostoController, CombustivelController, PrecoController],
  providers: [AppService, PostoService, CombustivelService, PrecoService],
})
export class AppModule {}
