# Boilerplate
This repository contains the Codebase for the wordpress theme.

## Get Started
Clone this repository and in order to make this boilerplate compatible with your project, first, search the words `boilerplate` and `Boilerplate` in the entire project and change it to the name of your project.

## Required plugins
- Advanced custom fields pro
- svg support

## Installation
Run the following commands to get setup:

```
npm install
```
```
composer install
```

You'll also need to setup the `.env` file for your local environment. Please use the `.env.example` file as a starting point.
**NOTE: Do not commit your `.env` file to the repository**

- See `package.json` for `dev` build scripts.

## Template Structure
`_components`
This folder contains bits of re-usable components for around the site.

`_includes`
This folder contains re-usable blocks such as Sliders, Hero Sections & Headers.

`_layouts`
This folder contains the base files for public webpages.

## License
N/A
