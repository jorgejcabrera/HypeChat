# HypeChat API Rest

[![Build Status](https://travis-ci.com/jorgejcabrera/HypeChat.svg?branch=master)](https://travis-ci.com/jorgejcabrera/HypeChat)

## Run
* `docker-compose up`

The API will listen on `localhost:3000`, and reload on any changes to the source.

## Changes to de DB schema
The API uses Sequelize to connect to its PostgreSQL DB, and changes are handled using Sequelize-CLI. When making changes to the DB schema, follow these steps:

* Create a new migration that contains the changes to be added.
* Implement those changes in the Sequelize model.
* Run migration.

## Contributors
- Jorge Cabrera
- Rodrigo Zapico
