<h1 align="center">
  PISE FCM-backend microservice on deta
</h1>

<p align="center">made by FHDW PISE Group 2</p>

## Description

[Firebase FCM](https://firebase.google.com/docs/cloud-messaging)-serve-backend build with [nest](https://nestjs.com/) and deployed to [deta](https://www.deta.sh/)

## Installation

1. Clone project.
2. Install [nvm](https://github.com/nvm-sh/nvm#install--update-script)!
3. Install dependecies:
```bash
$ nvm use 14
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Deployment happens through Github Actions.

In case one wants to deploy the code to their own micro:
  1. Install deta-cli:
  ```bash
  $ curl -fsSL https://get.deta.dev/cli.sh | sh
  ```
  2. Login and create new micro if you do not have one already:
  ```bash
  $ deta login
  $ deta new --project default --runtime nodejs14 --name pise-fcm-backend
  ```
  3. Deploy:
  ```bash
  # CI/CD - from a file! ;)
  # Run linter, tests, build and deploy
  $ npm run deploy
  ```
  4. Browse to your url:
  ```bash
  # Find url
  $ deta details
  ```
