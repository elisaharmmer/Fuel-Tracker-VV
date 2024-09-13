import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  @Get()
  getHello(): { message: string; ok: boolean } {
    return {
      message: this.appService.getHello(),
      ok: true,
    };
  }

  // Rota para listar todas as rotas disponíveis com domínio completo
  @Get('/routes')
  getRoutes(@Req() request: Request) {
    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer();
    console.log('HttpServer', httpServer);

    // Acessa o roteador do Express (verifica se existe)
    const router = httpServer?._events?.request?._router;
    if (!router) {
      console.error('Router not available on this platform.');
      return {
        description:
          'No router available in the current environment. This might be Vercel.',
        routes: [],
      };
    }

    // Extrai o domínio (host) da requisição
    const host = `${request.protocol}://${request.get('host')}`;

    console.log('Host', host);

    const routes = router.stack
      .filter((layer) => layer.route) // Filtra apenas as rotas
      .map((layer) => ({
        method: Object.keys(layer.route.methods)[0].toUpperCase(),
        path: `${host}${layer.route.path}`, // Adiciona o domínio completo ao caminho
      }));

    const result = {
      description:
        'Lista de todas as rotas disponíveis na API com domínio completo',
      routes,
    };
    console.log('RESULT', result);
    return result;
  }
}
