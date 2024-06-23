import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as passport from 'passport';

//1. backend 로그인 
//2. ethers js로 로그인 시에 지갑 생성되는 로직 
//3. 카카오 페이로 돈 입금시에 지갑에 해당되는 usdt 구입해주는 로직  (컨트랙트로)
//4. 마켓 플레이스 로직   
//5. 마켓플레이스에서 구입 클릭시에 uniswap 호출 
//6. 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'awefaedfawdagewgwsawedfag',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    }
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT')

  await app.listen(port);
}
bootstrap();
