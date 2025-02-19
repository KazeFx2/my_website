#!/bin/sh

npm run build
nginx -s reload
cp ./src/images/*.png ./dist/src/images/
mkdir ./dist/src
mkdir ./dist/src/images
mkdir ./dist/fonts
cp ./src/images/* ./dist/src/images/
cp ./src/local/* ./dist/
cp ./fonts/* ./dist/fonts/