#!/bin/bash

browserify -v *.js --exclude intersects* -o intersects-standalone.js
c "$1"
cd ~/logue
npm update @yy/intersects
cd ~/components/intersects