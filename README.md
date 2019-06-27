# HypeChat API Rest

[![Build Status](https://travis-ci.com/jorgejcabrera/HypeChat.svg?branch=master)](https://travis-ci.com/jorgejcabrera/HypeChat)
:star: Star us on GitHub!
 
## Requirements
- Node
- Docker
- Postgres

## Installation
To clone and run this application, you'll need [Git](https://git-scm.com) and [Docker](https://www.docker.com/get-started) installed on your computer. From your command line:
 ```bash
$ docker-compose up -d
 ```
The API will listen on `localhost:3000`, and reload on any changes to the source.

## Changes to the DB schema
The API uses Sequelize to connect to its PostgreSQL DB, and changes are handled using Sequelize-CLI. When making changes to the DB schema, follow these steps:

* Create a new migration that contains the changes to be added.
* Implement those changes in the Sequelize model.
* Run migration 
```bash
$ docker-compose exec app npm run db:migrate
```

## Installing new packages
* If it's a package that'll be needed in production: 
```bash
docker-compose exec app npm install --save PACKAGE_NAME
```
* If it's a dev-only package (such as test frameworks): 
```bash
docker-compose exec app npm install --save-dev PACKAGE_NAME
```

## Test
Make sure that all tests pass and there are no code style errors by running `docker-compose exec app npm test` before pushing.

## Architecture
![alt text](https://github.com/jorgejcabrera/HypeChat/blob/master/api/img/Arquitectura.png)

## Contributors
- Jorge Cabrera
- Rodrigo Zapico
