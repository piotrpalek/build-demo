#!/bin/bash

path=${2:-"../../"}     # path is the target folder. By default it's ../../

if [ -d "${path}demo" ]; then
  # Control will enter here if project/demo exists.
  node ./index "$path" "$@"    # running against the folder containing node_modules/build-demo
  cd "${path}tmp"         # cd to tmp in there
  npm install             # npm
  npm link jspm gulp gulp-concat gulp-connect gulp-rename gulp-shell gulp-open
  jspm install            # install
  jspm dl-loader          # update loaders
fi


