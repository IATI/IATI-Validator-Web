[![Deploy_To_Azure_Blobs_NG_Dev](https://github.com/IATI/IATI-Validator-Web/actions/workflows/develop_CD.yml/badge.svg)](https://github.com/IATI/IATI-Validator-Web/actions/workflows/develop_CD.yml)
[![Deploy_To_Production_Blob_on_Release](https://github.com/IATI/IATI-Validator-Web/actions/workflows/main_CD.yml/badge.svg)](https://github.com/IATI/IATI-Validator-Web/actions/workflows/main_CD.yml)

# IATI-Validator-Web

This repo contains the Angular Front End for the IATI Validator.

## Environment variables

The app must be built where `env.js` has the appropriate environment variables to point to the backend API

### Local dev setup

1. Copy example env.js file `cp src/env.dev.js src/env.js`
2. Update to use the necessary variables (localhost if you're running the backend locally as well, or use dev)
3. Run `npm install` to install dependencies

### Live Deployments

GitHub actions is set up to copy the following before building the Angular application. So make the appropriate changes in those files and deploy to reflect those changes.

### Dev

`cp src/env.dev.js src/env.js`

### Prod

`cp src/env.prod.js src/env.js`

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build:dev` or `ng build` to build the project for development. The build artifacts will be stored in the `dist/` directory. Use `npm run build:prod` for a production build.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
