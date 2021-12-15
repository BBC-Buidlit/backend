# Backend

### List Of Contents

- Introduction
- Installation Guide
- Get started with Postman
- Architecture
- Database schema

### Introduction

The Backend provides API layer for the application which stores the necessary data and interactes with blockchain. It serves the business layer for the application.

### Installation Guide

- To get started, clone the repository.
- Use `npm i ` to install all required dependencies.
- Run `docker-compose up` to server up mongodb server locally.
- Copy `.env.example` and create another file `.env` and fill out required keys.
  - **PORT** : Port on which you want to run your applicatiion.
  - **CLIENT_ID**: Discord's Client ID
  - **DISCORD_REDIRECT**: Discord's Redirect URI for Oauth
  - **FRONTEND_URL**: Frontend URI
  - **DISCORD_AUTH**: The authorization key for Discord Oauth.
  - **DB_URL**: Database URL
  - **JWT_SECRET**: JWT key required to sign token
  - **DISCORD_BOT_KEY**: Discord's Bot Key

> To understand more about Discord API please refer [Discord API Docs](https://discord.com/developers/docs/intro)

- Run `npm run dev` to run dev server,
- You can also run `npm run build` to build the application.

### Get Started With Postman

Postman is GUI tool for API testing, to import the application, go to Postman and click on `import` and then select file `BBC-Backend.postman_collection.json`.
To access private routes you would require to register useron the application.

### Architecture

The application follows repository design system and abstracts the application into three layers, the controller, service and the model layer.

The file structure is as follows:

- Controllers: It contains all the controllers of the application
- Service: All business logic resides here, services can interact with each other or the model layer or client layer.
- Models: It holds all the schema and models of the Database entities.
- Client: These are classes which interacts with third party services.
- Libs: All generic modules are stored here.
- Views: These holds all the view modules which casts the models and sends only required fields.
- Exceptions: Holds all the exceptions.

### Database Schema

The database is designed in a way to keep read queries fast as possible, considering we're fetching most of the data from Discord itself.

![Database Schema](https://cdn.discordapp.com/attachments/908632937405243445/918499771080130561/Screenshot_2021-12-09_at_7.20.02_PM.png)

### Backend architecture

![Backend architecture](https://cdn.discordapp.com/attachments/908632937405243445/920208693772058634/1523b267-6d30-4489-8497-f1c4a81405f5.jpg)
