# The Board Game Collection of Luke S. Phillips

[![Main Build](https://github.com/lsphillips/my-board-games/actions/workflows/build-and-deploy.yml/badge.svg?branch=main)](https://github.com/lsphillips/my-board-games/actions)

The source code for the board game collection web application of Luke S. Phillips.

## The Game List

The web application is generated from a [game list file](gamelist.yml) that is embellished with metadata sourced from the [Board Game Geek API](https://boardgamegeek.com/wiki/page/BGG_XML_API2). This file has two top level properties: [games](#games) and [locations](#locations).

### Games

The games property is a required array that defines the games collection. Each item in an array is an object that represents a single board game that has the following properties:

| Property       | Required | Type      | Default | Description                                                                                     |
| -------------- | :------: | :-------: | :-----: | ----------------------------------------------------------------------------------------------- |
| `name`         | Yes      | `string`  |         | The name of the board game.                                                                     |
| `bggId`        | Yes      | `number`  |         | The Board Game Geek ID for the board game.                                                      |
| `bgaId`        | No       | `string`  |         | The Board Game Arena ID for the board game.                                                     |
| `tabletopiaId` | No       | `string`  |         | The Tabletopia ID for the board game.                                                           |
| `favourite`    | No       | `boolean` | `false` | Indicates whether the board game is a favourite or not.                                         |
| `location`     | Yes      | `string`  |         | The key corresponding to a location, defined [here](#locations), that the board game is stored. |
| `expansions`   | No       | `array`   |         | The expansions owned for the board game. This is an array of [expansion objects](#expansions).  |
| `quick`        | No       | `boolean` | `false` | Indicates if the board game is quick to play.                                                   |

### Expansions

| Property     | Required | Type      | Default | Description                                                                                                                                                                   |
| ------------ | :------: | :-------: | :-----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | Yes      | `string`  |         | The name of the board game expansion.                                                                                                                                         |
| `bggId`      | Yes      | `number`  |         | The Board Game Geek ID for the board game expansion.                                                                                                                          |
| `location`   | No       | `string`  |         | The key corresponding to a location, defined [here](#locations), that the board game is stored. If this is omitted then it's assumed that it is located in the base game box. |

## Locations

The locations property is a required key-value map defining the locations where board games are stored. Each location object has the following properties:

| Property     | Required | Type      | Default | Description                                              |
| ------------ | :------: | :-------: | :-----: | -------------------------------------------------------- |
| `name`       | Yes      | `string`  |         | The name of the location.                                |
| `accessible` | Yes      | `boolean` |         | Indicates whether the location is easy to access or not. |

## Development

### Building

To build a deployable bundle in the `website` directory, run this command:

``` bash
npm run build
```

### Running locally

To run the website on a local development server running on port `1992`, run this command:

``` bash
npm run start
```

> [!TIP]
> Changes in [client JavaScript](src/scripts), [stylesheets](src/styles), [templates](src/templates), [favicons](src/favicon) and the [gamelist](gamelist.yml) will trigger the website to be rebuilt.

### Code Quality

To perform code quality checks, powered by ESLint, run this command:

``` bash
npm run lint
```

Please refer to the [eslint.config.js](eslint.config.js) file to familiar yourself with the rules.

## Deployment

The web application is hosted through GitHub Pages. The deployment is faciliated by the [Build & Deploy](.github/workflows/build-and-deploy.yml) GitHub Action Workflow, where it will perform a build and deploy the resulting artifact to GitHub Pages.
