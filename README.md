# _NOTE_

## IATI-Validator-Web#main-legacy-v1 
- v1 of the IATI Validator is now deprecated and superseded by v2
- This branch `main-legacy-v1` of the repository is legacy code from v1 and not maintained by IATI
- Please see `main` branch for live code, and `develop` for development.

[Full Announcement](https://iatistandard.org/en/news/iati-focuses-on-improving-data-quality-by-enhancing-validator-services/)

# DqfApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --environment sandbox` to start a server with the settings in `environments/environment.sandbox.ts`.
Make sure the environment is also declared in `.angular-cli.json`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Creating and testing a Docker image

Create the docker image with

```
docker build -t test-me .
```

and then start and stop it with

```
# start the docker container
docker run --name test-me -d --rm -p 8123:80 test-me

# visit http://0.0.0.0:8123/iati-feedback (or the location you specified)

# stop the docker container
docker stop test-me
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
