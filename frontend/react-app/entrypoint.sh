#!/bin/sh


npm rebuild esbuild
npm install
npm run watch
npm start

exec "$@"