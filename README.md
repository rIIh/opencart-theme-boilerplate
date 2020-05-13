### Read before start

[OpenCart installation](ocstore/IMPORTANT.md)

## Installation

1. `yarn`
2. `./src/rename.sh default <name of extension>`

## Project structure:

- **live** - directory where extension theme static saved
- **ocstore** - preconfigured clean opencart
- **src** - extension development files
- **store** - docker mounted volume of merged opencart and compiled extension

## Grunt tasks:

- **default** - clears store, compiles extension, merges them together and watch for changes
- **live** - clears live, compiles extension and watch for changes
- **reinstall_store** - clears store volume 

## Docker:

Start OpenCart: 

`docker-compose up -d && grunt`
