import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  // Verifica o status geral da API com logs detalhados
  @Get()
  @HealthCheck()
  checkGeneral() {
    const startTime = Date.now();
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]).then(result => {
      const endTime = Date.now();
      return {
        ...result,
        info: {
          ...result.info,
          responseTime: `${endTime - startTime}ms`,
          description: 'Status geral da API',
        }
      };
    });
  }

  // Verifica o status detalhado do banco de dados com logs
  @Get('/database')
  @HealthCheck()
  checkDatabase() {
    const startTime = Date.now();
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]).then(result => {
      const endTime = Date.now();
      return {
        ...result,
        info: {
          ...result.info,
          responseTime: `${endTime - startTime}ms`,
          description: 'Verificação detalhada do banco de dados',
        }
      };
    });
  }
}
