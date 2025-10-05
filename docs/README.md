# Story Grammar Loader - Interactive Demo

This folder contains the GitHub Pages demo for the Story Grammar Loader project.

## Files

- **`index.html`** - Interactive web demo with character generator
- **`story-grammar-loader.js`** - Standalone webpack UMD bundle (includes all dependencies)
- **`rpg-character.json`** - RPG character configuration file

## Features

The interactive demo allows you to:

- 🎲 Generate individual RPG character stories
- 📚 Generate multiple stories at once
- 🎯 View individual character component statistics
- ⚙️ Inspect the JSON configuration
- 🎮 Use keyboard shortcuts (Ctrl+Enter for single, Shift+Enter for multiple)

## Usage

Simply open `index.html` in a web browser or visit the GitHub Pages URL to try the demo.

The demo loads the RPG character configuration and allows real-time story generation using the Story Grammar Loader library.

## Configuration

The demo uses `rpg-character.json` which defines:

- **Character Classes**: warrior, mage, rogue, cleric
- **Dynamic Weapons**: Based on character class
- **Item Rarities**: Weighted distribution from common to legendary
- **Character Levels**: Random range 1-20
- **Names**: Template-based with first names, titles, and surnames
- **Day Cycles**: Sequential time periods
- **Functions**: Random gold generation and dice rolling

## Development

To update the demo:

1. Make changes to the source code
2. Run `npm run build:docs` to rebuild and update the demo bundle
3. Update the JSON configuration as needed

The `build:docs` script automatically:

- Builds the standalone webpack bundle (includes all dependencies)
- Copies the bundle to the docs folder
- Updates the JSON configuration

## GitHub Pages

This demo is designed to be served from GitHub Pages. The files are self-contained and don't require a build server.
