## Description

Message Service [Nest](https://github.com/nestjs/nest) framework TypeScript.

## Project setup

Start Docker Desktop, then start Redis for the email queue and abuse protection:

```bash
docker compose up -d redis
docker compose exec redis redis-cli ping
```

The ping should return `PONG`. The application defaults to `localhost:6379`;
set `REDIS_HOST` and `REDIS_PORT` in `.env` if using another Redis instance.

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Andre Luiz Alexandrini](https://www.linkedin.com/in/andre-alexandrini)
- Website - [https://tevui.com](https://tevui.com/)
