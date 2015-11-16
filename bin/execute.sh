jshint --verbose .
jade public/**
node-sass -o public public/**/*.scss
node server.js
