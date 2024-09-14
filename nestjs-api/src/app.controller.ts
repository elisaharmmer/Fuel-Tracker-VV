import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { UtilService } from './services/util.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly utilService: UtilService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  @Get()
  getHello(): { message: string; ok: boolean } {
    return {
      message: this.appService.getHello(),
      ok: true,
    };
  }

  @Get('/rotas')
  getRoutes(@Req() request: Request) {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
    const router = httpServer?._events?.request?._router;
    if (!router) {
      console.error('Router not available on this platform.');
      return {
        description:
          'Nenhuma rota disponível no ambiente atual. Pode ser Vercel.',
        routes: [],
      };
    }

    const host = `${request.protocol}://${request.get('host')}`;
    const routes = router.stack
      .filter((layer) => layer.route) // Filtra apenas as rotas
      .map((layer) => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: `${host}${layer.route.path}`, // Adiciona o domínio completo ao caminho
      }));

    return {
      description:
        'Lista de todas as rotas disponíveis na API com domínio completo',
      routes,
    };
  }

  @Get('utils')
  async getUtils() {
    return this.utilService.getAll();
  }

  @Get('datas')
  async getDatas() {
    return this.utilService.getMesesAnosDisponiveis();
  }

  @Get('bairros')
  async getBairros() {
    return this.utilService.getBairrosDisponiveis();
  }
}
