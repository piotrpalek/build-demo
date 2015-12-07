#!/bin/bash

path="./"

if [ -d "${path}demo" ]; then
  # Control will enter here if project/demo exists.
  evcl-demo-generator "$path" "$@"    # running against the folder containing node_modules/build-demo
  cd "${path}tmp"         # cd to tmp in there
  npm install             # npm
  npm link gulp gulp-concat gulp-connect gulp-rename gulp-shell gulp-open
  jspm install            # install
  jspm dl-loader --latest          # update loaders
fi


