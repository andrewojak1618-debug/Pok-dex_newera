<div align="center">

# ![DarkDex icon](./assets/icons/darkPok_favicon.png) DarkDex Pokedex

</div>

<div align="center">

![Learning project](https://img.shields.io/badge/Learning_Project-Frontend-00939b?style=for-the-badge)
![Project status](https://img.shields.io/badge/Status-in_development-7d3cff?style=for-the-badge)
![API](https://img.shields.io/badge/API-PokeAPI-ffcc00?style=for-the-badge)

</div>

<div align="center">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="HTML5 logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="CSS3 logo" />
<img width="12" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="JavaScript logo" />
<img width="12" />
<img src="https://pokeapi.co/static/pokeapi_256.3fa72200.png" height="40" alt="PokeAPI logo" />

</div>

<div align="center">

DarkDex is a responsive cyber-neon Pokedex that loads Pokemon data dynamically from the official PokeAPI.
The app focuses on fetch-then-render, caching, lazy-loaded evolution data, searchable Pokemon cards, a detail panel, and a modal dialog with navigation.

</div>

## Live Demo

The GitHub Pages link is prepared here:

[DarkDex Pokedex](https://andrewojak1618-debug.github.io/Pok-dex_newera/)

> Note: The link works after GitHub Pages is enabled for this repository.

## Preview

A moving preview GIF can be added later, for example:

```text
assets/screenshots/darkdex-preview.gif
```

## Table Of Contents

- [Requirements](#requirements)
- [Tech Stack](#tech-stack)
- [Data Source](#data-source)
- [Quickstart](#quickstart)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)
- [GitHub Pages](#github-pages)
- [Learning Goals](#learning-goals)

## Requirements

No build tools are required. The project can run with a local development server, for example the Live Server extension in VS Code.

## Tech Stack

| Technology      | Purpose                                          |
| --------------- | ------------------------------------------------ |
| HTML5           | Page structure                                   |
| CSS3            | Cyber-neon design, layout, responsive styling    |
| JavaScript ES6+ | API requests, rendering, caching, interactions   |
| PokeAPI         | Pokemon data, images, species and evolution data |

## Data Source

Pokemon data is loaded from the official [PokeAPI](https://pokeapi.co/).

## Quickstart

1. Clone the repository:

```bash
git clone https://github.com/andrewojak1618-debug/Pok-dex_newera.git
```

2. Open the project folder:

```bash
cd Pok-dex_newera
```

3. Start a local development server:

```text
For example: Live Server in VS Code
```

4. Open the local URL in your browser:

```text
http://localhost:<live-server-port>
```

## Usage

- Browse the initially loaded Pokemon cards.
- Use "Load More" to fetch the next Pokemon group.
- Search for a Pokemon by entering at least three letters.
- Click a Pokemon card to open the detail dialog.
- Use "Previous" and "Next" in the dialog to navigate through visible Pokemon.
- The right detail panel keeps the last selected Pokemon visible.

## Project Structure

```text
.
|-- .gitignore
|-- README.md
|-- index.html
|-- style.css
|-- assets/
|   |-- gifs-icon/
|   |-- icons/
|   `-- images/
|-- css/
|   `-- molecules/
|       |-- assets.css
|       |-- buttons.css
|       |-- color.css
|       |-- dialog.css
|       |-- fonts.css
|       |-- footer.css
|       `-- mediaquery.css
`-- js/
    |-- globalState.js
    |-- main.js
    |-- pokemonApi.js
    |-- pokemonData.js
    |-- pokemonDetails.js
    `-- templates.js
```

## Features

| Feature           | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| Fetch-then-render | Data is loaded before the UI is rendered.                          |
| Caching           | Already loaded Pokemon, species and evolution data are reused.     |
| Lazy loading      | Evolution chains are fetched only after a Pokemon card is clicked. |
| Loading feedback  | A loading screen gives visual feedback during API requests.        |
| Search            | Search starts with at least three entered letters.                 |
| Load More         | More Pokemon can be loaded in controlled batches.                  |
| Detail panel      | The last selected Pokemon stays visible on the right side.         |
| Dialog view       | Shows Pokemon details, stats, evolution and navigation.            |
| Responsive design | Layout is optimized down to small mobile widths.                   |
| Data attributes   | Required `data-id` attributes are included for testability.        |

## GitHub Pages

To publish the project with GitHub Pages:

1. Push the project to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Select the source branch, usually `main` or `master`.
5. Select the root folder `/`.
6. Save the settings.

After the deployment is complete, the app should be available at:

```text
https://andrewojak1618-debug.github.io/Pok-dex_newera/
```

## Learning Goals

This project is built as a frontend learning project. Important practice areas are:

- working with API requests
- rendering HTML with template functions
- separating CSS into focused files
- using meaningful function and variable names
- keeping functions small and readable
- building responsive layouts
- using caching and lazy loading deliberately
