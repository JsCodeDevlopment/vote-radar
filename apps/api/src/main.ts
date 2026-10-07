import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Gerenciamento dinâmico e seguro de CORS para ambientes locais e produção (deploy)
  app.enableCors(getCorsConfig());

  // Normaliza requisições com barras duplas para evitar erros 404 ou 308
  app.use((req: any, res: any, next: any) => {
    if (req.url && req.url.includes('//')) {
      req.url = req.url.replace(/\/{2,}/g, '/');
    }
    next();
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend rodando na porta ${port} com dados de parlamentares reais (independente de banco no Docker)`);
}
bootstrap();
