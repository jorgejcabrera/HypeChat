# HypeChat API Rest

[![Build Status](https://travis-ci.com/jorgejcabrera/HypeChat.svg?branch=master)](https://travis-ci.com/jorgejcabrera/HypeChat)
[![GitHub Issues](https://img.shields.io/github/issues/jorgejcabrera/HypeChat.svg)](https://github.com/jorgejcabrera/HypeChat/issues)
[![codecov](https://codecov.io/gh/jorgejcabrera/HypeChat/branch/master/graphs/sunburst.svg)](https://codecov.io/gh/jorgejcabrera/HypeChat)
https://img.shields.io/codecov/c/github/jorgejcabrera/HypeChat.svg

<h3 align="left"> :star: Star us on GitHub! </h3>

**Available for Android.**
<p align="center">
  <img src = "https://github.com/jorgejcabrera/HypeChat/blob/master/api/img/demo1.jpeg" width=350>
</p>
Hypechat-api is microservice in Node for a full-featured and high performance chat application. This is a node.js chat application powered by Express that provides the main functions you'd expect from a chat, such as emojis, private messages, an admin system, etc.

## Requirements
- Node
- Docker
- Postgres

## Features
A few of the things you can do with HypeChat:
- [X] Create groups
- [X] Create workspaces
- [X] Share files 
- [X] Private messaging
- [X] User @mentioning
- [X] Works on Mac, Linux and (maybe) Windows

## Installation
To clone and run this application, you'll need [Git](https://git-scm.com) and [Docker](https://www.docker.com/get-started) installed on your computer. From your command line:
 ```bash
$ docker-compose up -d
 ```
The API will listen on `localhost:3000`, and reload on any changes to the source.

### Changes to the DB schema
The API uses Sequelize to connect to its PostgreSQL DB, and changes are handled using Sequelize-CLI. When making changes to the DB schema, follow these steps:

* Create a new migration that contains the changes to be added.
* Implement those changes in the Sequelize model.
* Run migration 
```bash
$ docker-compose exec app npm run db:migrate
```

### Installing new packages
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
![alt text](https://github.com/jorgejcabrera/HypeChat/blob/master/api/img/Arquitectura.jpg)

## Contributors
- Jorge Cabrera
- Rodrigo Zapico
